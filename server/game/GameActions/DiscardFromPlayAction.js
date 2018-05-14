const CardGameAction = require('./CardGameAction');
const LeavesPlayEvent = require('../Events/LeavesPlayEvent');

class DiscardFromPlayAction extends CardGameAction {
    constructor(isSacrifice = false) {
        super(isSacrifice ? 'sacrifice' : 'discardFromPlay');
        this.targetType = ['character', 'attachment', 'holding'];
        this.effect = isSacrifice ? 'sacrifice {0}' : 'discard {0}';
        this.cost = 'sacrificing {0}';
    }

    canAffect(card, context) {
        if(card.type === 'holding') {
            if(!card.location.includes('province')) {
                return false;
            }
        } else if(card.location !== 'play area') {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return new LeavesPlayEvent({ context: context }, card, this);
    }
}

module.exports = DiscardFromPlayAction;
