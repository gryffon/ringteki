class GameActionCost {
    constructor(action) {
        this.action = action;
    }

    getActionName() {
        return this.action.name;
    }

    canPay(context) {
        return this.action.hasLegalTarget(context);
    }

    addEventsToArray(events, context) {
        context.costs[this.action.name] = this.action.getProperties(context).target;
        this.action.addEventsToArray(events, context);
    }

    getCostMessage(context) {
        return this.action.getCostMessage(context);
    }
}

module.exports = GameActionCost;
