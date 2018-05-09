const GameAction = require('./GameAction');

class RingAction extends GameAction {
    constructor(name) {
        super(name);
        this.targetType = ['ring'];
    }

    getDefaultTargets(context) {
        return context.ring;
    }

    checkEventCondition(event) {
        return this.canAffect(event.ring);
    }
}

module.exports = RingAction;
