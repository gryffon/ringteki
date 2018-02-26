class BowCost {
    constructor() {
        this.name = 'bow';
    }

    isEligible(card) {
        return (card.location === 'play area' || card.isStronghold) && !card.bowed;
    }

    payEvent(cards, context) {
        return context.game.getEventsForGameAction('bow', cards, context);
    }
}

module.exports = BowCost;
