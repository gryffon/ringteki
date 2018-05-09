class PlayerCost {
    constructor(action) {
        this.action = action;
    }

    canPay(context) {
        return this.action.canAffect(context.player, context);
    }

    resolve(context, result = { resolved: false }) {
        context.costs[this.action.name] = context.player;

        result.resolved = true;
        result.value = this.action.setTarget(context.player, context);
        return result;
    }

    payEvent() {
        return this.action.getEventArray();
    }
}

module.exports = PlayerCost;
