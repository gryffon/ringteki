const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');
const { EventNames } = require('../Constants');

const { EffectNames } = require('../Constants');

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
        this.costHandler = costHandler;
        this.resolutionHandler = resolutionHandler;
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.setCurrentDuel()),
            new SimpleStep(this.game, () => this.promptForHonorBid()),
            new SimpleStep(this.game, () => this.modifyDuelingSkill()),
            new SimpleStep(this.game, () => this.determineResults()),
            new SimpleStep(this.game, () => this.announceResult()),
            new SimpleStep(this.game, () => this.applyDuelResults()),
            new SimpleStep(this.game, () => this.cleanUpDuel()),
            new SimpleStep(this.game, () => this.game.checkGameState(true))
        ]);
    }

    setCurrentDuel() {
        this.duel.previousDuel = this.game.currentDuel;
        this.game.currentDuel = this.duel;
        this.game.checkGameState(true);
    }

    promptForHonorBid() {
        let prohibitedBids = {};
        for(const player of this.game.getPlayers()) {
            prohibitedBids[player.uuid] = [...new Set(player.getEffects(EffectNames.CannotBidInDuels))];
        }
        this.game.promptForHonorBid('Choose your bid for the duel\n' + this.duel.getTotalsForDisplay(), this.costHandler, prohibitedBids, this.duel);
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
        this.game.raiseEvent(EventNames.AfterDuel, { duel: this.duel, winner: this.duel.winner, loser: this.duel.loser });
    }

    applyDuelResults() {
        this.game.raiseEvent(EventNames.OnDuelResolution, { duel: this.duel }, () => this.resolutionHandler(this.duel));
    }

    cleanUpDuel() {
        this.game.currentDuel = this.duel.previousDuel;
        this.game.raiseEvent(EventNames.OnDuelFinished, { duel: this.duel });
    }
}

module.exports = DuelFlow;
