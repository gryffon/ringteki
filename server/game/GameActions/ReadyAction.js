const CardGameAction = require('./CardGameAction');
const { Locations, CardTypes, EventNames } = require('../Constants');

class ReadyAction extends CardGameAction {
    setup() {
        this.name = 'ready';
        this.targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Stronghold];
        this.effectMsg = 'ready {0}';
        this.cost = 'readying {0}';
    }

    canAffect(card, context) {
        if((card.location !== Locations.PlayArea && !card.isStronghold) || !card.bowed) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent(EventNames.OnCardReadied, { card: card, context: context }, () => card.ready());
    }
}

module.exports = ReadyAction;
