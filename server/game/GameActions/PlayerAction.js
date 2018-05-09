const GameAction = require('./GameAction');

class PlayerAction extends GameAction {
    constructor(name) {
        super(name);
        this.targetType = ['player'];
    }

    getDefaultTargets(context) {
        return context.player.opponent;
    }

    checkEventCondition(event) {
        return this.canAffect(event.player);
    }
}

module.exports = PlayerAction;
