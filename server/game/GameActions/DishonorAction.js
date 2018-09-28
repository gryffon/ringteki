const CardGameAction = require('./CardGameAction');

class DishonorAction extends CardGameAction {
    setup() {
        this.name = 'dishonor';
        this.targetType = ['character'];
        this.effectMsg = 'dishonor {0}';
        this.cost = 'dishonoring {0}';
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || card.type !== 'character' || card.isDishonored) {
            return false;
        } else if(!card.isHonored && !card.checkRestrictions('becomeDishonored', context)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onCardDishonored', { card, context }, event => event.card.dishonor());
    }
}

module.exports = DishonorAction;
