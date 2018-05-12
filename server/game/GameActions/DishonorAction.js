const CardGameAction = require('./CardGameAction');

class DishonorAction extends CardGameAction {
    constructor() {
        super('dishonor');
        this.effect = 'dishonor {0}';
        this.cost = 'dishonoring {0}';
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || card.type !== 'character' || card.isDishonored) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onCardDishonored', { card: card, context: context }, () => card.dishonor());
    }
}

module.exports = DishonorAction;
