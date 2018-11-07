const CardGameAction = require('./CardGameAction');
const { Locations, CardTypes } = require('../Constants');

class HonorAction extends CardGameAction {
    setup() {
        this.name = 'honor';
        this.targetType = [CardTypes.Character];
        this.effectMsg = 'honor {0}',
        this.cost = 'honoring {0}';
    }

    canAffect(card, context) {
        if(card.location !== Locations.PlayArea || card.type !== CardTypes.Character || card.isHonored) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onCardHonored', { card, context }, event => event.card.honor());
    }
}

module.exports = HonorAction;
