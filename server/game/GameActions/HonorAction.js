const CardGameAction = require('./CardGameAction');

class HonorAction extends CardGameAction {
    constructor() {
        super('honor');
        this.effect = 'honor {0}',
        this.cost = 'honoring {0}';
    }

    canAffect(card) {
        if(card.location !== 'play area' || card.type !== 'character' || card.isHonored) {
            return false;
        }
        return super.canAffect(card);
    }

    getEvent(card) {
        return super.createEvent('onCardHonored', { card: card, context: this.context }, () => card.honor());
    }
}

module.exports = HonorAction;
