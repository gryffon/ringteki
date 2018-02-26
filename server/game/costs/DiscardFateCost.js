class DiscardFateCost {
    constructor() {
        this.name = 'discardFate';
    }

    isEligible(card) {
        return card.location === 'play area' && card.type === 'character' && card.fate > 0 && card.allowGameAction('removeFate');
    }

    payEvent(cards, context) {
        return context.game.getEventsForGameAction('removeFate', cards, context);
    }
}

module.exports = DiscardFateCost;
