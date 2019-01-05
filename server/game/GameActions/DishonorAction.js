const CardGameAction = require('./CardGameAction');
const { Locations, CardTypes, EventNames } = require('../Constants');

class DishonorAction extends CardGameAction {
    setup() {
        this.name = 'dishonor';
        this.targetType = [CardTypes.Character];
        this.effectMsg = 'dishonor {0}';
        this.cost = 'dishonoring {0}';
    }

    canAffect(card, context) {
        if(card.location !== Locations.PlayArea || card.type !== CardTypes.Character || card.isDishonored) {
            return false;
        } else if(!card.isHonored && !card.checkRestrictions('becomeDishonored', context)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent(EventNames.OnCardDishonored, { card, context }, event => event.card.dishonor());
    }
}

module.exports = DishonorAction;
