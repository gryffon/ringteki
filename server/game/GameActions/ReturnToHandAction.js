const CardGameAction = require('./CardGameAction');
const LeavesPlayEvent = require('../Events/LeavesPlayEvent');
const { Locations } = require('../Constants');

class ReturnToHandAction extends CardGameAction {
    setDefaultProperties() {
        this.location = 'play area';
    }

    setup() {
        this.name = 'returnToHand';
        this.targetType = ['character', 'attachment'];
        this.effectMsg = 'return {0} to their hand';
        this.cost = 'returning {0} to their hand';
    }

    canAffect(card, context) {
        if(card.location !== this.location) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        if(this.location === 'play area') {
            return new LeavesPlayEvent({ context: context, destination: Locations.Hand }, card, this);
        }
        return super.createEvent('onMoveCard', { card: card, context: context }, () => card.owner.moveCard(card, Locations.Hand));
    }
}

module.exports = ReturnToHandAction;
