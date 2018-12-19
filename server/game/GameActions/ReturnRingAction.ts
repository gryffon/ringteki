import { RingAction, RingActionProperties} from './RingAction';
import { EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import Event = require('../Events/Event');
import Ring = require('../ring');

export interface ReturnRingProperties extends RingActionProperties {
}

export class ReturnRingAction extends RingAction {
    name = 'returnRing';
    effect = 'return {0} to the unclaimed pool';

    canAffect(ring: Ring, context: AbilityContext): boolean {
        return !ring.isUnclaimed() && super.canAffect(ring, context);
    }

    getEvent(ring: Ring, context: AbilityContext): Event {
        return this.createEvent(EventNames.OnReturnRing, { ring: ring, context: context }, () => ring.resetRing());
    }
}
