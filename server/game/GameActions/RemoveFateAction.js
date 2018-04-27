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
        this.cost = 'removing ' + amount + ' fate from {0}';
        this.effectItems = () => {
            return this.amount;
        };
    }

    checkRecipient() {
        if(!this.recipient || ['player, ring'].includes(this.recipient.type)) {
            return true;
        }
        this.recipient.gameAction.card = this.recipient;
        this.recipient.gameAction.context = this.context;
        return this.recipientGameAction.canAffect(this.recipient);
    }

    canAffect(card) {
        if(card.location !== 'play area' || card.fate === 0 || card.type !== 'character') {
            return false;
        }
        return super.canAffect(card) && this.checkRecipient();
    }

    getEvent(card, amount = this.amount, recipient = this.recipient) {
        return new MoveFateEvent({ context: this.context }, amount, card, recipient, this);
    }
}

module.exports = RemoveFateAction;
