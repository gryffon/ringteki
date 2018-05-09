const CardGameAction = require('./CardGameAction');
const MoveFateEvent = require('../Events/MoveFateEvent');
const PlaceFateAction = require('./PlaceFateAction');

class RemoveFateAction extends CardGameAction {
    constructor(amount = 1, recipient = null) {
        super('removeFate');
        this.amount = amount;
        this.recipient = recipient;
        this.recipientGameAction = new PlaceFateAction(amount);
        this.effect = 'remove {1} fate from {0}';
        this.effectArgs = () => {
            return this.amount;
        };
        this.cost = 'removing ' + amount + ' fate from {0}';
    }

    checkRecipient(context = this.context) {
        if(!this.recipient || ['player, ring'].includes(this.recipient.type)) {
            return true;
        }
        return this.recipientGameAction.canAffect(this.recipient, context);
    }

    canAffect(card, context = this.context) {
        if(card.location !== 'play area' || card.fate === 0 || card.type !== 'character') {
            return false;
        }
        return super.canAffect(card, context) && this.checkRecipient(context);
    }

    getEvent(card, context = this.context) {
        return new MoveFateEvent({ context: context }, this.amount, card, this.recipient, this);
    }
}

module.exports = RemoveFateAction;
