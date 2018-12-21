class RingCost {
    constructor(action, ringCondition = (ring, context) => true, message) { // eslint-disable-line no-unused-vars
        this.action = action;
        this.action.costMessage = message;
        this.ringCondition = ringCondition;
        this.promptsPlayer = true;
    }

    canPay(context) {
        this.action.origin = context.player;
        let rings = Object.values(context.game.rings);
        return rings.some(ring => this.ringCondition(ring, context) && this.action.canAffect(ring, context, { origin: context.player }));
    }

    resolve(context, result) {
        context.game.promptForRingSelect(context.player, {
            context: context,
            buttons: result.canCancel ? [{ text: 'Cancel', arg: 'cancel' }] : [],
            ringCondition: (ring, context) => this.ringCondition(ring, context) && this.action.canAffect(ring, context, { origin: context.player }),
            onSelect: (player, ring) => {
                context.costs[this.action.name] = ring;
                return true;
            },
            onCancel: () => result.cancelled = true
        });
    }

    payEvent(context) {
        return this.action.getEventArray(context, { target: context.costs[this.action.name], origin: context.player });
    }
}

module.exports = RingCost;
