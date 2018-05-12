const CardGameAction = require('./CardGameAction');
const LeavesPlayEvent = require('../Events/LeavesPlayEvent');

class ReturnToHandAction extends CardGameAction {
    constructor() {
        super('returnToHand');
        this.effect = 'return {0} to their hand';
        this.cost = 'returning {0} to their hand';
    }

    canAffect(card, context) {
        if(card.location !== 'play area') {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return new LeavesPlayEvent({ context: context, destination: 'hand' }, card, this);
    }
}

module.exports = ReturnToHandAction;
