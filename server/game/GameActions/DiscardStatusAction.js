const CardGameAction = require('./CardGameAction');
const { Locations, CardTypes } = require('../Constants');

class DiscardStatusAction extends CardGameAction {
    setup() {
        this.name = 'discardStatus';
        this.targetType = [CardTypes.Character];
        this.effectMsg = 'discard {0}\'s status token';
    }

    canAffect(card, context) {
        if(card.location !== Locations.PlayArea || !card.isHonored && !card.isDishonored) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onCardStatusDiscarded', { card: card, context: context }, () => {
            card.isHonored = false;
            card.isDishonored = false;
        });
    }
}

module.exports = DiscardStatusAction;
