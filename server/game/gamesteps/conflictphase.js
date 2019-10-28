const AbilityDsl = require('../abilitydsl.js');

const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const Conflict = require('../conflict.js');
const ActionWindow = require('./actionwindow.js');
const GameActions = require('../GameActions/GameActions');
const { Phases } = require('../Constants');

/*
III Conflict Phase
3.1 Conflict phase begins.
    ACTION WINDOW
    NOTE: After this action window, if no conflict
    opporunities remain, proceed to (3.4).
3.2 Next player in player order declares a
    conflict(go to Conflict Resolution), or passes
    (go to 3.3).
3.3 Conflict Ends/Conflict was passed. Return to
    the action window following step (3.1).
3.4 Determine Imperial Favor.
3.4.1 Glory count.
3.4.2 Claim Imperial Favor.
3.5 Conflict phase ends.

 */

class ConflictPhase extends Phase {
    constructor(game) {
        super(game, Phases.Conflict);
        this.initialise([
            new SimpleStep(this.game, () => this.beginPhase()),
            new ActionWindow(this.game, 'Action Window', 'preConflict'),
            new SimpleStep(this.game, () => this.startConflictChoice())
        ]);
    }

    beginPhase() {
        this.currentPlayer = this.game.getFirstPlayer();
    }

    startConflictChoice() {
        if(this.currentPlayer.getConflictOpportunities() === 0 && this.currentPlayer.opponent) {
            this.currentPlayer = this.currentPlayer.opponent;
        }
        if(this.currentPlayer.getConflictOpportunities() > 0) {
            if(GameActions.initiateConflict().canAffect(this.currentPlayer, this.game.getFrameworkContext(this.currentPlayer))) {
                GameActions.initiateConflict().resolve(this.currentPlayer, this.game.getFrameworkContext(this.currentPlayer));
            } else {
                var conflict = new Conflict(this.game, this.currentPlayer, this.currentPlayer.opponent);
                conflict.passConflict('{0} passes their conflict opportunity as none of their characters can be declared as an attacker');
            }
            if(this.currentPlayer.opponent) {
                this.currentPlayer = this.currentPlayer.opponent;
            }
            this.game.queueStep(new ActionWindow(this.game, 'Action Window', 'preConflict'));
            this.game.queueStep(new SimpleStep(this.game, () => this.startConflictChoice()));
        } else {
            this.game.queueStep(new SimpleStep(this.game, () => this.claimImperialFavor()));
        }
    }

    claimImperialFavor() {
        AbilityDsl.actions.performGloryCount({
            gameAction: winner => winner && AbilityDsl.actions.claimImperialFavor({
                target: winner
            })
        }).resolve(null, this.game.getFrameworkContext());
    }
}

module.exports = ConflictPhase;
