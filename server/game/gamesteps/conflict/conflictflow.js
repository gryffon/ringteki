const _ = require('underscore');
const BaseStep = require('../basestep.js');
const GamePipeline = require('../../gamepipeline.js');
const SimpleStep = require('../simplestep.js');
const ActionWindow = require('../actionwindow.js');
const InitiateConflictPrompt = require('./initiateconflictprompt.js');

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

class ConflictFlow extends BaseStep {
    constructor(game, conflict) {
        super(game);
        this.conflict = conflict;
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.resetCards()),
            new InitiateConflictPrompt(this.game, this.conflict, this.conflict.attackingPlayer),
            new SimpleStep(this.game, () => this.checkRevealProvince()),
            new SimpleStep(this.game, () => this.announceAttackerSkill()),
            new SimpleStep(this.game, () => this.promptForDefenders()),
            new SimpleStep(this.game, () => this.announceDefenderSkill()),
            new ActionWindow(this.game, 'Conflict Action Window', 'conflictAction'),
            new SimpleStep(this.game, () => this.determineWinner()),
            //new SimpleStep(this.game, () => this.applyKeywords()),
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

    announceConflict() {
        this.game.addMessage('{0} is initiating a {1} conflict', this.conflict.attackingPlayer, this.conflict.conflictType);
    }

    promptForAttackers() {
        var title = 'Select conflict attackers';
        if(this.conflict.attackingPlayer.conflictrLimit !== 0) {
            title += ' (limit ' + this.conflict.attackingPlayer.conflictrLimit + ')';
        }

        this.game.promptForSelect(this.conflict.attackingPlayer, {
            numCards: this.conflict.attackingPlayer.conflictrLimit,
            multiSelect: true,
            activePromptTitle: title,
            waitingPromptTitle: 'Waiting for opponent to select attackers',
            cardCondition: card => this.allowAsAttacker(card),
            onSelect: (player, attackers) => this.chooseAttackers(player, attackers),
            onCancel: () => this.conflict.cancelConflict()
        });
    }

    allowAsAttacker(card) {
        return this.conflict.attackingPlayer === card.controller && card.canDeclareAsAttacker(this.conflict.conflictType);
    }

    chooseAttackers(player, attackers) {
        this.conflict.addAttackers(attackers);

        return true;
    }
    
    checkRevealProvince() {
        if (this.conflict.cancelled) {
            return;
        }
        
        this.conflict.attackingPlayer.conflicts.perform(this.conflict.conflictType, true);
        this.conflict.defendingPlayer.conflicts.perform(this.conflict.conflictType, false);

        if (this.conflict.conflictprovince.facedown) {
            this.conflict.defendingPlayer.revealProvince(this.conflict.conflictprovince);
        }
        this.game.raiseEvent('onConflictDeclared', this.conflict);
    }

    announceAttackerSkill() {
        if (this.conflict.cancelled) {
            return;
        }

        // Explicitly recalculate strength in case an effect has modified character strength.
        this.conflict.calculateStrength();
        this.game.addMessage('{0} has initiated a {1} conflict with strength {2}', this.conflict.attackingPlayer, this.conflict.conflictType, this.conflict.attackerStrength);
    }

    promptForDefenders() {
        if (this.conflict.cancelled) {
            return;
        }

        if(this.conflict.isSinglePlayer) {
            return;
        }

        var title = 'Select defenders';
        if(this.conflict.defendingPlayer.conflictrLimit !== 0) {
            title += ' (limit ' + this.conflict.defendingPlayer.conflictrLimit + ')';
        }

        this.game.promptForSelect(this.conflict.defendingPlayer, {
            numCards: this.conflict.defendingPlayer.conflictrLimit,
            multiSelect: true,
            activePromptTitle: title,
            waitingPromptTitle: 'Waiting for opponent to defend',
            cardCondition: card => this.allowAsDefender(card),
            onSelect: (player, defenders) => this.chooseDefenders(defenders),
            onCancel: () => this.chooseDefenders([])
        });
    }

    allowAsDefender(card) {
        return this.conflict.defendingPlayer === card.controller && card.canDeclareAsDefender(this.conflict.conflictType);
    }

    chooseDefenders(defenders) {
        this.conflict.addDefenders(defenders);

        this.game.raiseEvent('onDefendersDeclared', this.conflict);

        return true;
    }

    announceDefenderSkill() {
        // Explicitly recalculate strength in case an effect has modified character strength.
        this.conflict.calculateStrength();
        if(this.conflict.defenders.length > 0) {
            this.game.addMessage('{0} has defended with strength {1}', this.conflict.defendingPlayer, this.conflict.defenderStrength);
        } else {
            this.game.addMessage('{0} does not defend the conflict', this.conflict.defendingPlayer);
        }
    }

    determineWinner() {
        if (this.conflict.cancelled) {
            return;
        }

        this.conflict.determineWinner();

        if(!this.conflict.winner && !this.conflict.loser) {
            this.game.addMessage('There is no winner or loser for this conflict because both sides have 0 skill');
        } else {
            this.game.addMessage('{0} won a {1} conflict {2} vs {3}',
                this.conflict.winner, this.conflict.conflictType, this.conflict.winnerStrength, this.conflict.loserStrength);
        }
        
        this.conflict.winner.conflicts.won(this.conflict.conflictType, this.conflict.winner === this.conflict.attackingPlayer);
        this.conflict.loser.conflicts.lost(this.conflict.conflictType, this.conflict.loser === this.conflict.attackingPlayer);
        

        this.game.raiseEvent('afterConflict', this.conflict);
    }

    applyKeywords() {
        var winnerCards = this.conflict.getWinnerCards();

        _.each(winnerCards, () => {
            this.game.checkWinCondition(this.conflict.winner);
        });
    }

    applyUnopposed() {
        if (this.conflict.cancelled) {
            return;
        }

        if (this.conflict.winner === this.conflict.attackingPlayer && this.conflict.defenders.length === 0) {
            this.game.addHonor(this.conflict.loser, -1);
        }
    }
    
    checkBreakProvince() {
        if (this.conflict.cancelled) {
            return;
        }

        let province = this.conflict.conflictProvince;
        if (this.conflict.winner === this.conflict.attackingPlayer && 
                this.conflict.skillDifference >= province.getStrength) {
            this.game.raiseEvent('onBreakProvince', province, province.breakProvince);
        }
    }
    
    resolveRingEffects() {
        if (this.conflict.cancelled) {
            return;
        }

        if (this.conflict.winner === this.conflict.attackingPlayer) {
            this.game.raiseEvent('onResolveRingEffects', this.conflict.conflictRing, this.conflict.winner.resolveRingEffects);
        }       
    }
    
    claimRing() {
        if (this.conflict.cancelled) {
            return;
        }

        if (this.conflict.winner) {
            let ring = _.find(this.game.rings, ring => {
                return ring.element === this.conflict.conflictRing;
            });
            this.game.raiseEvent('onClaimRing', this.conflict.winner, ring.claimRing);
        }
    }
    
    returnHome() {
        if (this.conflict.cancelled) {
            return;
        }

        this.game.raiseEvent('onReturnHome', this.conflict);
        _.each(this.conflict.attackers, card => card.returnHomeFromConflict(this.conflict));
        _.each(this.conflict.defenders, card => card.returnHomeFromConflict(this.conflict));
    }
    
    completeConflict() {
        if (this.conflict.cancelled) {
            return;
        }

        this.game.raiseEvent('onConflictFinished', this.conflict);

        this.resetCards();

        this.conflict.finish();
    }

    onCardClicked(player, card) {
        return this.pipeline.handleCardClicked(player, card);
    }

    onMenuCommand(player, arg, method) {
        return this.pipeline.handleMenuCommand(player, arg, method);
    }

    cancelStep() {
        this.pipeline.cancelStep();
    }

    queueStep(step) {
        this.pipeline.queueStep(step);
    }

    continue() {
        return this.conflict.cancelled || this.pipeline.continue();
    }
}

module.exports = ConflictFlow;
