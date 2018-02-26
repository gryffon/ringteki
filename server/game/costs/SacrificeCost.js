class SacrificeCost {
    constructor() {
        this.name = 'sacrifice';
    }

    isEligible(card) {
        return (card.location === 'play area' || card.type === 'holding') && !card.facedown;
    }

    payEvent(cards, context) {
        return context.game.getEventsForGameAction('sacrifice', cards, context);
    }
}

module.exports = SacrificeCost;
