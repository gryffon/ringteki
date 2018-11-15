const CardGameAction = require('./CardGameAction');
const MoveFateEvent = require('../Events/MoveFateEvent');
const { Locations, CardTypes } = require('../Constants');

class RemoveFateAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = 1;
        this.recipient = null;
    }

    setup() {
        this.name = 'removeFate';
        this.targetType = [CardTypes.Character];
        this.effectMsg = 'remove ' + this.amount + ' fate from {0}';
        this.cost = 'removing ' + this.amount + ' fate from {0}';
    }

    checkRecipient(context) {
        if(!this.recipient || ['player', 'ring'].includes(this.recipient.type)) {
            return true;
        }
        return this.recipient.allowGameAction('placeFate', context);
    }

    canAffect(card, context) {
        if(card.location !== Locations.PlayArea || card.fate === 0 || this.amount === 0) {
            return false;
        }
        return super.canAffect(card, context) && this.checkRecipient(context);
    }

    checkEventCondition(event) {
        return this.canAffect(event.origin, event.context);
    }

    fullyResolved(event) {
        return this.target.length === 0 || this.target.includes(event.origin);
    }

    getEvent(card, context) {
        return new MoveFateEvent({ context: context }, this.amount, card, this.recipient, this);
    }
}

module.exports = RemoveFateAction;
