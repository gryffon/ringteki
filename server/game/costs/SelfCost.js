class SelfCost {
    constructor(action, unpayAction) {
        this.action = action;
        this.unpayAction = unpayAction;
    }

    canPay(context) {
        return this.action.canAffect(context.source, context);
    }

    resolve(context) {
        context.costs[this.action.name] = context.source;
    }

    payEvent(context) {
        return this.action.getEventArray(context, { target: context.source });
    }
}

module.exports = SelfCost;
