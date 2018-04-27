const CardGameAction = require('./CardGameAction');
const LeavesPlayEvent = require('../Events/LeavesPlayEvent');

class DiscardFromPlayAction extends CardGameAction {
    constructor(isSacrifice = false) {
        let action = isSacrifice ? 'sacrifice' : 'discardFromPlay';
        super(action);
        this.effect = isSacrifice ? 'sacrifice {0}' : 'discard {0}';
        this.cost = isSacrifice ? 'sacrificing {0}' : '';
    }

    canAffect(card) {
        if(card.location !== 'play area') {
            return false;
        }
        return super.canAffect(card);
    }

    getEvent(card) {
        return new LeavesPlayEvent({ context: this.context }, card, this);
    }
}

module.exports = DiscardFromPlayAction;
