const CardGameAction = require('./CardGameAction');

class RevealAction extends CardGameAction {
    constructor() {
        super('reveal');
        this.effect = 'reveal {0}';
        this.cost = 'revealing {0}';
    }

    canAffect(card, context = this.context) {
        if(!card.facedown) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context = this.context) {
        return super.createEvent('onCardRevealed', { card: card, context: context });
    }
}

module.exports = RevealAction;
