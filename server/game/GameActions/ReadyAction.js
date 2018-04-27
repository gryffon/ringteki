const CardGameAction = require('./CardGameAction');

class ReadyAction extends CardGameAction {
    constructor() {
        super('ready');
        this.effect = 'ready {0]';
        this.cost = 'readying {0}';
    }

    canAffect(card) {
        if(card.location !== 'play area' || !card.bowed) {
            return false;
        }
        return super.canAffect(card);
    }

    getEvent(card) {
        return super.createEvent('onCardReadied', { card: card, context: this.context }, () => card.ready());
    }
}

module.exports = ReadyAction;
