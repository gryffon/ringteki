class PlayerCost {
    constructor(action) {
        this.action = action;
    }

    canPay(context) {
        return this.action.canAffect(context.player, context);
    }

    resolve(context) {
        context.costs[this.action.name] = context.player;
    }

    payEvent(context) {
        return this.action.getEventArray(context, { target: context.player });
    }
}

module.exports = PlayerCost;
