const CardGameAction = require('./CardGameAction');
const MoveFateEvent = require('../Events/MoveFateEvent');

class PlaceFateAction extends CardGameAction {
    constructor(amount) {
        super('placeFate');
        this.amount = amount;
        this.effect = 'place {1} fate on {0}';
        this.effectItems = () => {
            return this.amount;
        };
    }

    canAffect(card) {
        if(card.location !== 'play area' || card.type !== 'character') {
            return false;
        }
        return super.canAffect(card);
    }

    getEvent(card, amount = this.amount) {
        return new MoveFateEvent({ context: this.context }, amount, null, card, this);
    }
}

module.exports = PlaceFateAction;
