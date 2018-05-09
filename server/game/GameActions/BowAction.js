const CardGameAction = require('./CardGameAction');

class BowAction extends CardGameAction {
    constructor() {
        super('bow');
        this.effect = 'bow {0}';
        this.cost = 'bowing {0}';
    }

    canAffect(card, context = this.context) {
        if(card.location !== 'play area' || card.bowed) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context = this.context) {
        return super.createEvent('onCardBowed', { card: card, context: context }, () => card.bow());
    }
}

module.exports = BowAction;
