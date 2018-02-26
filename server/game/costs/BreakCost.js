class BreakCost {
    constructor() {
        this.name = 'break';
    }

    isEligible(card) {
        return card.type === 'province' && !card.isBroken && card.allowGameAction('break');
    }

    payEvent(cards, context) {
        return context.game.getEventsForGameAction('break', cards, context);
    }
}

module.exports = BreakCost;
