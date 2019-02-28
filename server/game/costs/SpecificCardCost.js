class SpecificCardCost {
    constructor(action, cardFunc) {
        this.action = action;
        this.cardFunc = cardFunc;
    }

    canPay(context) {
        let card = this.cardFunc(context);
        //handle cases where "card" is actually an array of cards
        if(Array.isArray(card)) {
            return card.every(c => this.action.canAffect(c, context));
        }
        return this.action.canAffect(card, context);
    }

    resolve(context) {
        context.costs[this.action.name] = this.cardFunc(context);
    }

    payEvent(context) {
        return this.action.getEventArray(context, { target: context.costs[this.action.name] });
    }
}

module.exports = SpecificCardCost;
