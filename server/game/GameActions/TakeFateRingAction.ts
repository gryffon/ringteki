import AbilityContext = require('../AbilityContext');
import Ring = require('../ring');
import { RingAction, RingActionProperties} from './RingAction';
import { EventNames } from '../Constants';

export interface TakeFateRingProperties extends RingActionProperties {
    amount?: number,
    removeOnly?: boolean
}

export class TakeFateRingAction extends RingAction {
    name = 'takeFate';
    eventName = EventNames.OnMoveFate;
    defaultProperties: TakeFateRingProperties = { amount: 1, removeOnly: false };
    constructor(properties: ((context: AbilityContext) => TakeFateRingProperties) | TakeFateRingProperties) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as TakeFateRingProperties;
        return ['{2} {1} fate from {0}', [properties.target, properties.amount, properties.removeOnly ? 'remove' : 'take']];
    }

    canAffect(ring: Ring, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as TakeFateRingProperties;
        return context.player.checkRestrictions('takeFateFromRings', context) &&
               ring.fate > 0 && properties.amount > 0 && super.canAffect(ring, context);
    }

    addPropertiesToEvent(event, ring: Ring, context: AbilityContext, additionalProperties): void {
        let properties = this.getProperties(context, additionalProperties) as TakeFateRingProperties;
        event.fate = properties.amount;
        event.origin = ring;
        event.context = context;
        event.recipient = properties.removeOnly ? null : context.player;
    }

    checkEventCondition(event): boolean {
        return this.moveFateEventCondition(event);
    }

    isEventFullyResolved(event, ring: Ring, context: AbilityContext, additionalProperties): boolean {
        let { amount } = this.getProperties(context, additionalProperties) as TakeFateRingProperties;
        return !event.cancelled && event.name === this.eventName && 
            event.fate === amount && event.origin === ring && event.recipient === context.player;
    }
    
    eventHandler(event): void {
        this.moveFateEventHandler(event);
    }
}
