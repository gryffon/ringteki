const CardGameAction = require('./CardGameAction');
const { Locations, CardTypes } = require('../Constants');

class BowAction extends CardGameAction {
    setup() {
        this.name = 'bow';
        this.targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Stronghold];
        this.effectMsg = 'bow {0}';
        this.cost = 'bowing {0}';
    }

    canAffect(card, context) {
        if(card.location !== Locations.PlayArea && card.type !== CardTypes.Stronghold || card.bowed) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onCardBowed', { card: card, context: context }, () => card.bow());
    }
}

module.exports = BowAction;
