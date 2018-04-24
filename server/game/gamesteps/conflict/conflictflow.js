const _ = require('underscore');
const AbilityContext = require('../../AbilityContext');
const BaseStepWithPipeline = require('../basestepwithpipeline.js');
const CovertAbility = require('../../KeywordAbilities/CovertAbility');
const SimpleStep = require('../simplestep.js');
const ConflictActionWindow = require('./conflictactionwindow.js');
const InitiateConflictPrompt = require('./initiateconflictprompt.js');
const SelectDefendersPrompt = require('./selectdefendersprompt.js');

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
    constructor(game, conflict) {
        super(game);
        this.conflict = conflict;
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
        if(this.conflict.attackingPlayer.allowGameAction('chooseConflictRing') || !this.conflict.attackingPlayer.opponent) {
            this.pipeline.queueStep(new InitiateConflictPrompt(this.game, this.conflict, this.conflict.attackingPlayer));
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
                    ringCondition: ring => ring.canDeclare(this.conflict.attackingPlayer),
                    onSelect: (player, ring) => {
                        if(this.conflict.attackingPlayer.conflicts.isAtMax(ring.conflictType)) {
                            ring.flipConflictType();
                        }
                        this.conflict.ring = ring;
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
        
        this.conflict.attackingPlayer.conflicts.perform(this.conflict.conflictType);
        _.each(this.conflict.attackers, card => card.inConflict = true);
        this.game.addMessage('{0} is initiating a {1} conflict at {2}, contesting {3}', this.conflict.attackingPlayer, this.conflict.conflictType, this.conflict.conflictProvince, this.conflict.ring);
    }

    promptForCovert() {
        this.covert = [];
        if(this.conflict.conflictPassed || this.conflict.isSinglePlayer) {
            return;
        }

        let targets = this.conflict.defendingPlayer.cardsInPlay.filter(card => card.covert);
        let sources = _.filter(this.conflict.attackers, card => card.isCovert());

        if(sources.length === 0) {
            return;
        }

        // Need to have:
        // - a legal combination of covert targets and covert attackers
        // - no remaining covert

        if(targets.length === sources.length) {
            for(let i = 0; i < targets.length; i++) {
                let context = new AbilityContext({ game: this.game, player: this.conflict.attackingPlayer, source: sources[i], ability: new CovertAbility() });
                context.targets.target = targets[i];
                this.covert.push(context);
            }
            if(this.covert.every(context => context.targets.target.canBeCovertedBy(context.source))) {
                return;
            }
            this.covert = [];
        }

        for(const source of sources) {
            this.game.promptForSelect(this.conflict.attackingPlayer, {
                activePromptTitle: 'Choose covert target for ' + source.name,
                buttons: [{ text: 'No target', arg: 'cancel' }],
                cardType: 'character',
                cardCondition: card => (
                    card.controller === this.conflict.defendingPlayer && card.canBeCovertedBy(source) && 
                    card.canBeDeclaredAsDefender()
                ),
                onSelect: (player, card) => {
                    let context = new AbilityContext({ game: this.game, player: this.conflict.attackingPlayer, source: source, ability: new CovertAbility() });
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

        this.game.raiseMultipleInitiateAbilityEvents(this.covert.map(context => ({
            params: { card: context.source, context: context },
            handler: () => context.target = true
        })));
    }

    raiseDeclarationEvents() {
        if(this.conflict.conflictPassed) {
            return;
        }

        let events = [this.game.getEvent('onConflictDeclared', { 
            conflict: this.conflict, 
            type: this.conflict.conflictType, 
            ring: this.conflict.ring
        })];

        let ring = this.conflict.ring;
        if(ring.fate > 0) {
            events.push(this.game.getEvent('onSelectRingWithFate', {
                player: this.conflict.attackingPlayer,
                conflict: this.conflict,
                ring: ring,
                fate: ring.fate
            }));
            if(this.conflict.attackingPlayer.allowGameAction('takeFateFromRings')) {
                this.game.addMessage('{0} takes {1} fate from {2}', this.conflict.attackingPlayer, ring.fate, ring);
                this.game.addFate(this.conflict.attackingPlayer, ring.fate);
                ring.removeFate();
            }
        }

        if(!this.conflict.isSinglePlayer) {
            this.conflict.conflictProvince.inConflict = true;
            if(this.conflict.conflictProvince.facedown) {
                events.push(this.game.getEvent('onProvinceRevealed', {
                    conflict: this.conflict,
                    province: this.conflict.conflictProvince
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

        this.game.raiseEvent('onDefendersDeclared', { conflict: this.conflict });
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

        if(!this.conflict.winner && !this.conflict.loser) {
            this.game.addMessage('There is no winner or loser for this conflict because both sides have 0 skill');
        } else {
            this.game.addMessage('{0} won a {1} conflict {2} vs {3}',
                this.conflict.winner, this.conflict.conflictType, this.conflict.winnerSkill, this.conflict.loserSkill);
            this.conflict.winner.conflicts.won(this.conflict.conflictType, this.conflict.winner === this.conflict.attackingPlayer);
            this.conflict.loser.conflicts.lost(this.conflict.conflictType, this.conflict.loser === this.conflict.attackingPlayer);
        }
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
            this.conflict.winner.conflicts.won(this.conflict.conflictType, this.conflict.winner === this.conflict.attackingPlayer);
            this.conflict.loser.conflicts.lost(this.conflict.conflictType, this.conflict.loser === this.conflict.attackingPlayer);
        }
        return true;
    }

    afterConflict() {
        this.game.checkGameState(true);
        
        if(this.conflict.isAttackerTheWinner() && this.conflict.defenders.length === 0) {
            this.conflict.conflictUnopposed = true;
        }
                
        this.game.raiseEvent('afterConflict', { conflict: this.conflict });
    }

    applyUnopposed() {
        if(this.conflict.conflictPassed || this.game.manualMode || this.conflict.isSinglePlayer) {
            return;
        }
        
        if(this.conflict.conflictUnopposed) {
            this.game.addMessage('{0} loses 1 honor for not defending the conflict', this.conflict.loser);
            this.game.addHonor(this.conflict.loser, -1);
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
            this.conflict.resolveRing();
        }       
    }
    
    claimRing() {
        if(this.conflict.conflictPassed) {
            return;
        }

        let ring = this.conflict.ring;
        if(ring.claimed) {
            return;
        }
        if(this.conflict.winner) {
            this.game.raiseEvent('onClaimRing', { player: this.conflict.winner, conflict: this.conflict }, () => ring.claimRing(this.conflict.winner));
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
        let attackerBowEvents = this.game.getEventsForGameAction('bow', this.conflict.attackers);
        // Cancel any events where attacker shouldn't bow
        _.each(attackerBowEvents, event => event.cancelled = !event.card.bowsOnReturnHome());

        // Create bow events for defenders
        let defenderBowEvents = this.game.getEventsForGameAction('bow', this.conflict.defenders);
        // Cancel any events where defender shouldn't bow
        _.each(defenderBowEvents, event => event.cancelled = !event.card.bowsOnReturnHome());

        let bowEvents = attackerBowEvents.concat(defenderBowEvents);

        // Create a return home event for every bow event
        let returnHomeEvents = _.map(bowEvents, event => this.game.getEvent(
            'onReturnHome', 
            { conflict: this.conflict, bowEvent: event, card: event.card }, 
            () => this.conflict.removeFromConflict(event.card)
        ));
        let events = bowEvents.concat(returnHomeEvents);
        events.push(this.game.getEvent('onParticipantsReturnHome', { returnHomeEvents: returnHomeEvents, conflict: this.conflict }));
        this.game.openEventWindow(events);
    }
    
    completeConflict() {
        if(this.conflict.conflictPassed) {
            return;
        }

        this.game.raiseEvent('onConflictFinished', { conflict: this.conflict });

        this.resetCards();
        if(!this.game.militaryConflictCompleted && (this.conflict.conflictType === 'military' || this.conflict.conflictTypeSwitched)) {
            this.game.militaryConflictCompleted = true;
        }
        if(!this.game.politicalConflictCompleted && (this.conflict.conflictType === 'political' || this.conflict.conflictTypeSwitched)) {
            this.game.politicalConflictCompleted = true;
        }
    }
}

module.exports = ConflictFlow;
