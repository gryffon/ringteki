const GameAction = require('./GameAction');

class RingAction extends GameAction {
    setup() {
        this.targetType = ['ring'];
    }

    defaultTargets(context) {
        if(context.game.currentConflict) {
            return context.game.currentConflict.ring;
        }
    }

    checkEventCondition(event) {
        return this.canAffect(event.ring, event.context);
    }
}

module.exports = RingAction;
