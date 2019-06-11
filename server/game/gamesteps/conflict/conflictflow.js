const _ = require('underscore');
const AbilityContext = require('../../AbilityContext');
const BaseStepWithPipeline = require('../basestepwithpipeline.js');
const CovertAbility = require('../../KeywordAbilities/CovertAbility');
const GameActions = require('../../GameActions/GameActions');
const SimpleStep = require('../simplestep.js');
const ConflictActionWindow = require('./conflictactionwindow.js');
const InitiateConflictPrompt = require('./initiateconflictprompt.js');
const SelectDefendersPrompt = require('./selectdefendersprompt.js');
const InitiateCardAbilityEvent = require('../../Events/InitiateCardAbilityEvent');

const { Players, CardTypes, EventNames } = require('../../Constants');

/**
Conflict Resolution
3.2 Declare Conflict
3.2.1 Declare defenders
3.2.2 CONFLICT ACTION WINDOW
    (Defender has first opportunity)
3.2.3 Compare skill values.
3.2.4 Apply unopposed.
3.2.5 Break province.
3.2.6 Resolve Ring effects.
3.2.7 Claim ring.
3.2.8 Return home. Go to (3.3).
 */

class ConflictFlow extends BaseStepWithPipeline {
    constructor(game, conflict, canPass) {
        super(game);
        this.conflict = conflict;
        this.canPass = canPass;
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.resetCards()),
            new SimpleStep(this.game, () => this.promptForNewConflict()),
            new SimpleStep(this.game, () => this.initiateConflict()),
            new SimpleStep(this.game, () => this.promptForCovert()),
            new SimpleStep(this.game, () => this.resolveCovert()),
            new SimpleStep(this.game, () => this.raiseDeclarationEvents()),
            new SimpleStep(this.game, () => this.announceAttackerSkill()),
            new SimpleStep(this.game, () => this.promptForDefenders()),
            new SimpleStep(this.game, () => this.announceDefenderSkill()),
            new SimpleStep(this.game, () => this.openConflictActionWindow()),
            new SimpleStep(this.game, () => this.determineWinner()),
            new SimpleStep(this.game, () => this.afterConflict()),
            new SimpleStep(this.game, () => this.applyUnopposed()),
            new SimpleStep(this.game, () => this.checkBreakProvince()),
            new SimpleStep(this.game, () => this.resolveRingEffects()),
            new SimpleStep(this.game, () => this.claimRing()),
            new SimpleStep(this.game, () => this.returnHome()),
            new SimpleStep(this.game, () => this.completeConflict())
        ]);
    }

    resetCards() {
        this.conflict.resetCards();
    }

    promptForNewConflict() {
        if(this.conflict.attackingPlayer.checkRestrictions('chooseConflictRing', this.game.getFrameworkContext()) || !this.conflict.attackingPlayer.opponent) {
            this.pipeline.queueStep(new InitiateConflictPrompt(this.game, this.conflict, this.conflict.attackingPlayer, true, this.canPass));
            return;
        }
        this.game.promptWithHandlerMenu(this.conflict.attackingPlayer, {
            source: 'Declare Conflict',
            activePromptTitle: 'Do you wish to declare a conflict?',
            choices: ['Declare a conflict', 'Pass conflict opportunity'],
            handlers: [
                () => this.game.promptForRingSelect(this.conflict.defendingPlayer, {
                    activePromptTitle: 'Choose a ring for ' + this.conflict.attackingPlayer.name + '\'s conflict',
                    source: 'Defender chooses conflict ring',
                    waitingPromptTitle: 'Waiting for defender to choose conflict ring',
                    ringCondition: ring => this.conflict.attackingPlayer.hasLegalConflictDeclaration({ ring }),
                    onSelect: (player, ring) => {
                        if(!this.conflict.attackingPlayer.hasLegalConflictDeclaration({ type: ring.conflictType, ring })) {
                            ring.flipConflictType();
                        }
                        this.conflict.ring = ring;
                        ring.contested = true;
                        this.pipeline.queueStep(new InitiateConflictPrompt(this.game, this.conflict, this.conflict.attackingPlayer, false));
                        return true;
                    }
                }),
                () => this.conflict.passConflict()
            ]
        });
    }

    initiateConflict() {
        if(this.conflict.conflictPassed) {
            return;
        }

        _.each(this.conflict.attackers, card => card.inConflict = true);
        this.game.recordConflict(this.conflict);
    }

    promptForCovert() {
        this.covert = [];
        if(this.conflict.conflictPassed || this.conflict.isSinglePlayer) {
            return;
        }

        let targets = this.conflict.defendingPlayer.cardsInPlay.filter(card => card.covert);
        let sources = this.conflict.attackers.filter(card => card.isCovert());

        if(sources.length === 0) {
            return;
        }

        for(let target of targets) {
            target.covert = false;
        }

        // Need to have:
        // - a legal combination of covert targets and covert attackers
        // - no remaining covert

        if(targets.length === sources.length) {
            for(let i = 0; i < targets.length; i++) {
                let context = new AbilityContext({ game: this.game, player: this.conflict.attackingPlayer, source: sources[i], ability: new CovertAbility() });
                context['target'] = context.targets.target = targets[i];
                this.covert.push(context);
            }
            if(this.covert.every(context => context.targets.target.canBeBypassedByCovert(context))) {
                return;
            }
            this.covert = [];
        }

        for(const source of sources) {
            let context = new AbilityContext({ game: this.game, player: this.conflict.attackingPlayer, source: source, ability: new CovertAbility() });
            this.game.promptForSelect(this.conflict.attackingPlayer, {
                activePromptTitle: 'Choose covert target for ' + source.name,
                buttons: [{ text: 'No Target', arg: 'cancel' }],
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                source: 'Choose Covert',
                cardCondition: card => card.canBeBypassedByCovert(context),
                onSelect: (player, card) => {
                    context['target'] = context.targets.target = card;
                    this.covert.push(context);
                    return true;
                }
            });
        }
    }

    resolveCovert() {
        if(this.covert.length === 0) {
            return;
        }

        let events = this.covert.map(context => new InitiateCardAbilityEvent(
            { card: context.source, context: context },
            () => context.target.covert = true
        ));
        events = events.concat(this.covert.map(context => this.game.getEvent(EventNames.OnCovertResolved, { card: context.source, context: context })));
        this.game.openEventWindow(events);
    }

    raiseDeclarationEvents() {
        if(this.conflict.conflictPassed) {
            return;
        }

        this.game.addMessage('{0} is initiating a {1} conflict at {2}, contesting {3}', this.conflict.attackingPlayer, this.conflict.conflictType, this.conflict.conflictProvince, this.conflict.ring);

        let events = [this.game.getEvent(EventNames.OnConflictDeclared, {
            conflict: this.conflict,
            type: this.conflict.conflictType,
            ring: this.conflict.ring,
            attackers: this.conflict.attackers.slice()
        })];

        let ring = this.conflict.ring;
        if(ring.fate > 0) {
            events.push(this.game.getEvent(EventNames.OnSelectRingWithFate, {
                player: this.conflict.attackingPlayer,
                conflict: this.conflict,
                ring: ring,
                fate: ring.fate
            }));
            if(this.conflict.attackingPlayer.checkRestrictions('takeFateFromRings', this.game.getFrameworkContext())) {
                this.game.addMessage('{0} takes {1} fate from {2}', this.conflict.attackingPlayer, ring.fate, ring);
                this.conflict.attackingPlayer.modifyFate(ring.fate);
                ring.removeFate();
            }
        }

        if(!this.conflict.isSinglePlayer) {
            this.conflict.conflictProvince.inConflict = true;
            if(this.conflict.conflictProvince.facedown) {
                events.push(this.game.getEvent(EventNames.OnCardRevealed, {
                    card: this.conflict.conflictProvince,
                    context: this.game.getFrameworkContext(this.conflict.attackingPlayer),
                    onDeclaration: true
                }, () => this.conflict.conflictProvince.facedown = false));
            }
        }

        this.game.openEventWindow(events);
    }

    announceAttackerSkill() {
        if(this.conflict.conflictPassed) {
            return;
        }

        this.game.addMessage('{0} has initiated a {1} conflict with skill {2}', this.conflict.attackingPlayer, this.conflict.conflictType, this.conflict.attackerSkill);
    }

    promptForDefenders() {
        if(this.conflict.conflictPassed || this.conflict.isSinglePlayer) {
            return;
        }

        this.game.queueStep(new SelectDefendersPrompt(this.game, this.conflict.defendingPlayer, this.conflict));
    }

    announceDefenderSkill() {
        if(this.conflict.conflictPassed || this.conflict.isSinglePlayer) {
            return;
        }

        _.each(this.conflict.defenders, card => card.inConflict = true);
        this.conflict.defendingPlayer.cardsInPlay.each(card => card.covert = false);

        if(this.conflict.defenders.length > 0) {
            this.game.addMessage('{0} has defended with skill {1}', this.conflict.defendingPlayer, this.conflict.defenderSkill);
        } else {
            this.game.addMessage('{0} does not defend the conflict', this.conflict.defendingPlayer);
        }

        this.game.raiseEvent(EventNames.OnDefendersDeclared, { conflict: this.conflict, defenders: this.conflict.defenders.slice() });
    }

    openConflictActionWindow() {
        if(this.conflict.conflictPassed) {
            return;
        }
        this.queueStep(new ConflictActionWindow(this.game, 'Conflict Action Window', this.conflict));
    }

    determineWinner() {
        if(this.conflict.conflictPassed) {
            return;
        }

        if(this.game.manualMode && !this.conflict.isSinglePlayer) {
            this.game.promptWithMenu(this.conflict.attackingPlayer, this, {
                activePrompt: {
                    promptTitle: 'Conflict Result',
                    menuTitle: 'How did the conflict resolve?',
                    buttons: [
                        { text: 'Attacker Won', arg: 'attacker', method: 'manuallyDetermineWinner' },
                        { text: 'Defender Won', arg: 'defender', method: 'manuallyDetermineWinner' },
                        { text: 'No Winner', arg: 'nowinner', method: 'manuallyDetermineWinner' }
                    ]
                },
                waitingPromptTitle: 'Waiting for opponent to resolve conflict'
            });
            return;
        }

        this.conflict.determineWinner();
    }

    manuallyDetermineWinner(player, choice) {
        if(choice === 'attacker') {
            this.conflict.winner = player;
            this.conflict.loser = this.conflict.defendingPlayer;
        } else if(choice === 'defender') {
            this.conflict.winner = this.conflict.defendingPlayer;
            this.conflict.loser = player;
        }
        if(!this.conflict.winner && !this.conflict.loser) {
            this.game.addMessage('There is no winner or loser for this conflict because both sides have 0 skill');
        } else {
            this.game.addMessage('{0} won a {1} conflict', this.conflict.winner, this.conflict.conflictType);
        }
        return true;
    }

    showConflictResult() {
        if(!this.conflict.winner && !this.conflict.loser) {
            this.game.addMessage('There is no winner or loser for this conflict because both sides have 0 skill');
        } else {
            this.game.addMessage('{0} won a {1} conflict {2} vs {3}',
                this.conflict.winner, this.conflict.conflictType, this.conflict.winnerSkill, this.conflict.loserSkill);
        }
    }

    afterConflict() {
        if(this.conflict.conflictPassed) {
            return;
        }

        this.game.checkGameState(true);

        const eventFactory = () => {
            let event = this.game.getEvent(EventNames.AfterConflict, { conflict: this.conflict }, () => {
                this.showConflictResult();
                this.game.recordConflictWinner(this.conflict);

                if(this.conflict.isAttackerTheWinner() && this.conflict.defenders.length === 0) {
                    this.conflict.conflictUnopposed = true;
                }
            });
            event.condition = event => {
                let prevWinner = event.conflict.winner;
                this.conflict.winnerDetermined = false;
                this.conflict.determineWinner();
                if(this.conflict.winner !== prevWinner) {
                    let newEvent = eventFactory();
                    event.window.addEvent(newEvent);
                    return false;
                }
                return true;
            };
            return event;
        };

        this.game.openEventWindow(eventFactory());
    }

    applyUnopposed() {
        if(this.conflict.conflictPassed || this.game.manualMode || this.conflict.isSinglePlayer) {
            return;
        }

        if(this.conflict.conflictUnopposed) {
            this.game.addMessage('{0} loses 1 honor for not defending the conflict', this.conflict.loser);
            GameActions.loseHonor({ dueToUnopposed: true }).resolve(this.conflict.loser, this.game.getFrameworkContext(this.conflict.loser));
        }
    }

    checkBreakProvince() {
        if(this.conflict.conflictPassed || this.conflict.isSinglePlayer || this.game.manualMode) {
            return;
        }

        let province = this.conflict.conflictProvince;
        if(this.conflict.isAttackerTheWinner() && this.conflict.skillDifference >= province.getStrength() && !province.isBroken) {
            this.game.applyGameAction(null, { break: province });
        }
    }

    resolveRingEffects() {
        if(this.conflict.conflictPassed) {
            return;
        }

        if(this.conflict.isAttackerTheWinner()) {
            GameActions.resolveConflictRing().resolve(this.conflict.ring, this.game.getFrameworkContext(this.conflict.attackingPlayer));
        }
    }

    claimRing() {
        if(this.conflict.conflictPassed) {
            return;
        }

        let ring = this.conflict.ring;
        if(ring.claimed) {
            ring.contested = false;
            return;
        }
        if(this.conflict.winner) {
            this.game.raiseEvent(EventNames.OnClaimRing, { player: this.conflict.winner, conflict: this.conflict }, () => ring.claimRing(this.conflict.winner));
        }
        //Do this lazily for now
        this.game.queueSimpleStep(() => {
            ring.contested = false;
            return true;
        });
    }

    returnHome() {
        if(this.conflict.conflictPassed) {
            return;
        }

        // Create bow events for attackers
        let attackerBowEvents = this.conflict.attackers.map(card => GameActions.bow().getEvent(card, this.game.getFrameworkContext()));
        // Cancel any events where attacker shouldn't bow
        _.each(attackerBowEvents, event => event.cancelled = !event.card.bowsOnReturnHome());

        // Create bow events for defenders
        let defenderBowEvents = this.conflict.defenders.map(card => GameActions.bow().getEvent(card, this.game.getFrameworkContext()));
        // Cancel any events where defender shouldn't bow
        _.each(defenderBowEvents, event => event.cancelled = !event.card.bowsOnReturnHome());

        let bowEvents = attackerBowEvents.concat(defenderBowEvents);

        // Create a return home event for every bow event
        let returnHomeEvents = _.map(bowEvents, event => this.game.getEvent(
            EventNames.OnReturnHome,
            { conflict: this.conflict, bowEvent: event, card: event.card },
            () => this.conflict.removeFromConflict(event.card)
        ));
        let events = bowEvents.concat(returnHomeEvents);
        events.push(this.game.getEvent(EventNames.OnParticipantsReturnHome, { returnHomeEvents: returnHomeEvents, conflict: this.conflict }));
        this.game.openEventWindow(events);
    }

    completeConflict() {
        if(this.conflict.conflictPassed) {
            return;
        }

        this.game.currentConflict = null;
        this.game.raiseEvent(EventNames.OnConflictFinished, { conflict: this.conflict });
        this.game.queueSimpleStep(() => this.resetCards());
    }
}

module.exports = ConflictFlow;
