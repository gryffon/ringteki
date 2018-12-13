const RingAction = require('./RingAction');
const { EventNames } = require('../Constants');

class TakeFateRingAction extends RingAction {
    setup() {
        super.setup();
        this.name = 'returnRing';
        this.effectMsg = 'return {0} to the unclaimed pool';
    }

    applyProperties(properties) {
        super.applyProperties(properties);
    }

    canAffect(ring, context) {
        return !ring.isUnclaimed() && super.canAffect(ring, context);
    }

    getEvent(ring, context) {
        return this.createEvent(EventNames.OnReturnRing, { ring: ring, context: context }, () => ring.resetRing());
    }
}

module.exports = TakeFateRingAction;
