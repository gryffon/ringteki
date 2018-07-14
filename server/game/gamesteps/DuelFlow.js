const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');

/**
D. Duel Timing
D.1 Duel begins.
D.2 Establish challenger and challengee.
D.3 Duel honor bid.
D.4 Reveal honor dials.
D.5 Transfer honor.
D.6 Modify dueling skill.
D.7 Compare skill value and determine results.
D.8 Apply duel results.
D.9 Duel ends.
 */

class DuelFlow extends BaseStepWithPipeline {
    constructor(game, duel, costHandler, resolutionHandler) {
        super(game);
        this.duel = duel;
        this.resolutionHandler = resolutionHandler;
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.game.checkGameState(true)),
            new SimpleStep(this.game, () => this.game.promptForHonorBid('Choose your bid for the duel\n' + duel.getTotalsForDisplay(), costHandler)),
            new SimpleStep(this.game, () => this.modifyDuelingSkill()),
            new SimpleStep(this.game, () => this.determineResults()),
            new SimpleStep(this.game, () => this.announceResult()),
            new SimpleStep(this.game, () => this.applyDuelResults()),
            new SimpleStep(this.game, () => this.cleanUpDuel()),
            new SimpleStep(this.game, () => this.game.checkGameState(true))
        ]);
    }

    modifyDuelingSkill() {
        this.duel.modifyDuelingSkill();
    }

    determineResults() {
        this.duel.determineResult();
    }

    announceResult() {
        this.game.addMessage(this.duel.getTotalsForDisplay());
        if(!this.duel.winner) {
            this.game.addMessage('The duel ends in a draw');
        }
        this.game.raiseEvent('afterDuel', { duel: this.duel, winner: this.duel.winner, loser: this.duel.loser });
    }

    applyDuelResults() {
        if(this.duel.winner) {
            this.game.raiseEvent('onDuelResolution', { duel: this.duel }, () => this.resolutionHandler(this.duel.winner, this.duel.loser));
        }
    }

    cleanUpDuel() {
        this.game.currentDuel = null;
        this.game.raiseEvent('onDuelFinished', { duel: this.duel });
    }
}

module.exports = DuelFlow;
