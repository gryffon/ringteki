const GameAction = require('./GameAction');

class CardGameAction extends GameAction {
    constructor(name) {
        super(name);
        this.cards = [];
    }

    setTarget(cards) {
        if(!cards) {
            return;
        }
        if(!Array.isArray(cards)) {
            cards = [cards];
        }
        this.cards = cards.filter(card => this.canAffect(card));
        return this.cards.length > 0;
    }

    canAffect(card) { // eslint-disable-line no-unused-vars
        return card.checkRestrictions(this.name, this.context);
    }

    checkEventCondition(event) {
        return this.canAffect(event.card);
    }

    getEventArray() {
        return this.cards.filter(card => this.canAffect(card)).map(card => this.getEvent(card));
    }

    getEvent(card) {
        return super.createEvent('unnamedEvent', { card: card });
    }
}

module.exports = CardGameAction;
