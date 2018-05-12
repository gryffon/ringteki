const GameAction = require('./GameAction');

class RingAction extends GameAction {
    constructor(name) {
        super(name);
        this.targetType = ['ring'];
    }

    getDefaultTargets(context) {
        if(context.game.currentConflict) {
            return context.game.currentConflict.ring;
        }
    }

    checkEventCondition(event) {
        return this.canAffect(event.ring, event.context);
    }
}

module.exports = RingAction;
