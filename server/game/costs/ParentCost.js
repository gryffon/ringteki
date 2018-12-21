class ParentCost {
    constructor(action) {
        this.action = action;
    }

    canPay(context) {
        return context.source.parent && this.action.canAffect(context.source.parent, context);
    }

    resolve(context) {
        context.costs[this.action.name] = context.source.parent;
    }

    payEvent(context) {
        return this.action.getEventArray(context, { target: context.source.parent });
    }
}

module.exports = ParentCost;
