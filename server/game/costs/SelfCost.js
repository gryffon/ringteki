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
        this.action.properties = Object.assign(this.action.getProperties(context), { target: context.source });
    }

    payEvent(context) {
        return this.action.getEventArray(context);
    }
}

module.exports = SelfCost;
