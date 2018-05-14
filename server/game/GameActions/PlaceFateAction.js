const CardGameAction = require('./CardGameAction');
const MoveFateEvent = require('../Events/MoveFateEvent');

class PlaceFateAction extends CardGameAction {
    constructor(amount = 1, origin) {
        super('placeFate');
        this.targetType = ['character'];
        this.amount = amount;
        this.origin = origin;
        this.effect = 'place ' + amount + ' fate on {0}';
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || card.type !== 'character') {
            return false;
        }
        return super.canAffect(card, context) && (!this.origin || this.origin.fate > 0);
    }

    checkEventCondition(event) {
        return this.canAffect(event.recipient, event.context);
    }

    getEvent(card, context) {
        return new MoveFateEvent({ context: context }, this.amount, this.origin, card, this);
    }
}

module.exports = PlaceFateAction;
