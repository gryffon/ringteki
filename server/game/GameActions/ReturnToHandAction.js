const CardGameAction = require('./CardGameAction');
const LeavesPlayEvent = require('../Events/LeavesPlayEvent');
const { Locations, CardTypes } = require('../Constants');

class ReturnToHandAction extends CardGameAction {
    setDefaultProperties() {
        this.location = Locations.PlayArea;
    }

    setup() {
        this.name = 'returnToHand';
        this.targetType = [CardTypes.Character, CardTypes.Attachment];
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
        if(this.location === Locations.PlayArea) {
            return new LeavesPlayEvent({ context: context, destination: Locations.Hand }, card, this);
        }
        return super.createEvent('onMoveCard', { card: card, context: context }, () => card.owner.moveCard(card, Locations.Hand));
    }
}

module.exports = ReturnToHandAction;
