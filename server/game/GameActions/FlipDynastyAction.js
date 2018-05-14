const CardGameAction = require('./CardGameAction');

class FlipDynastyAction extends CardGameAction {
    constructor() {
        super('reveal');
        this.targetType = ['character', 'holding'];
        this.effect = 'revealing {0}';
    }

    canAffect(card, context) {
        if(['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location) && card.isDynasty && card.facedown) {
            return super.canAffect(card, context);
        }
        return false;
    }

    getEvent(card, context) {
        return super.createEvent('onDynastyCardTurnedFaceup', { card: card, context: context }, () => card.facedown = false);
    }
}

module.exports = FlipDynastyAction;
