const CardGameAction = require('./CardGameAction');

class RevealAction extends CardGameAction {
    constructor() {
        super('reveal');
        this.effect = 'reveal {0}';
        this.cost = 'revealing {0}';
    }

    canAffect(card, context) {
        if(!card.facedown && card.location !== 'hand') {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onCardRevealed', { card: card, context: context });
    }
}

module.exports = RevealAction;
