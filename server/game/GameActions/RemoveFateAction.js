const CardGameAction = require('./CardGameAction');
const MoveFateEvent = require('../Events/MoveFateEvent');
const PlaceFateAction = require('./PlaceFateAction');

class RemoveFateAction extends CardGameAction {
    constructor(amount = 1, recipient = null) {
        super('removeFate');
        this.amount = amount;
        this.targetType = ['character'];
        this.recipient = recipient;
        this.recipientGameAction = new PlaceFateAction(amount);
        this.effect = 'remove {1} fate from {0}';
        this.effectArgs = () => {
            return this.amount;
        };
        this.cost = 'removing ' + amount + ' fate from {0}';
    }

    checkRecipient(context) {
        if(!this.recipient || ['player, ring'].includes(this.recipient.type)) {
            return true;
        }
        return this.recipientGameAction.canAffect(this.recipient, context);
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || card.fate === 0 || card.type !== 'character') {
            return false;
        }
        return super.canAffect(card, context) && this.checkRecipient(context);
    }

    checkEventCondition(event) {
        return this.canAffect(event.origin, event.context);
    }

    getEvent(card, context) {
        return new MoveFateEvent({ context: context }, this.amount, card, this.recipient, this);
    }
}

module.exports = RemoveFateAction;
