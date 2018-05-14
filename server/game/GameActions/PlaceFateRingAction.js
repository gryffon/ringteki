const RingAction = require('./RingAction');
const MoveFateEvent = require('../Events/MoveFateEvent');

class PlaceFateRingAction extends RingAction {
    constructor(amount = 1, origin) {
        super('placeFate');
        this.origin = origin;
        this.amount = amount;
        this.effect = 'move ' + amount + ' fate from {1} to {0}';
        this.effectArgs = () => {
            return this.origin;
        };
        this.cost = 'spending ' + amount + ' fate to {0}';
    }

    canAffect(ring, context) {
        return this.origin && this.origin.checkRestrictions('spendFate', context) && 
               this.origin.fate >= this.amount && super.canAffect(ring, context);
    }

    getEvent(ring, context) {
        return new MoveFateEvent({ context: context, ring: ring }, this.amount, this.origin, ring, this);
    }
}

module.exports = PlaceFateRingAction;
