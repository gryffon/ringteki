class ReturnToHandCost {
    constructor() {
        this.name = 'returnToHand';
    }

    isEligible(card) {
        return card.location === 'play area';
    }

    payEvent(cards, context) {
        return context.game.getEventsForGameAction('returnToHand', cards, context);
    }
}

module.exports = ReturnToHandCost;
