const CardGameAction = require('./CardGameAction');

class ReadyAction extends CardGameAction {
    constructor() {
        super('ready');
        this.targetType = ['character', 'attachment', 'stronghold'];
        this.effect = 'ready {0]';
        this.cost = 'readying {0}';
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || !card.bowed) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onCardReadied', { card: card, context: context }, () => card.ready());
    }
}

module.exports = ReadyAction;
