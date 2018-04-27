const CardGameAction = require('./CardGameAction');

class BowAction extends CardGameAction {
    constructor() {
        super('bow');
        this.effect = 'bow {0}';
        this.cost = 'bowing {0}';
    }

    canAffect(card) {
        if(card.location !== 'play area' || card.bowed) {
            return false;
        }
        return super.canAffect(card);
    }

    getEvent(card) {
        return super.createEvent('onCardBowed', { card: card, context: this.context }, () => card.bow());
    }
}

module.exports = BowAction;
