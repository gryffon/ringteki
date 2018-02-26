class DishonorCost {
    constructor() {
        this.name = 'dishonor';
    }

    isEligible(card) {
        return card.location === 'play area' && card.type === 'character' && card.allowGameAction('dishonor');
    }

    payEvent(cards, context) {
        return context.game.getEventsForGameAction('dishonor', cards, context);
    }
}

module.exports = DishonorCost;
