import AbilityContext = require('../AbilityContext');
import Event = require('../Events/Event');
import MoveFateEvent = require('../Events/MoveFateEvent');
import Ring = require('../ring');
import { RingAction, RingActionProperties} from './RingAction';

export interface TakeFateRingProperties extends RingActionProperties {
    amount?: number,
}

export class TakeFateRingAction extends RingAction {
    name = 'takeFate';
    defaultProperties: TakeFateRingProperties = { amount: 1 };
    constructor(properties: ((context: AbilityContext) => TakeFateRingProperties) | TakeFateRingProperties) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as TakeFateRingProperties;
        return ['take {1} fate from {0}', [properties.amount]];
    }

    canAffect(ring: Ring, context: AbilityContext): boolean {
        let properties = this.getProperties(context) as TakeFateRingProperties;
        return context.player.checkRestrictions('takeFateFromRings', context) &&
               ring.fate > 0 && properties.amount > 0 && super.canAffect(ring, context);
    }
    
    getEvent(ring: Ring, context: AbilityContext): Event {
        let properties = this.getProperties(context) as TakeFateRingProperties;
        return new MoveFateEvent({ context }, properties.amount, ring, context.player, this);
    }
}
