import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import Player = require('../player');
import Ring = require('../ring');
import { RingAction, RingActionProperties} from './RingAction';
import { EventNames } from '../Constants';

export interface PlaceFateRingProperties extends RingActionProperties {
    amount?: number,
    origin?: DrawCard | Player | Ring
}

export class PlaceFateRingAction extends RingAction {
    name = 'placeFate';
    eventName = EventNames.OnMoveFate;
    defaultProperties: PlaceFateRingProperties = { amount: 1 };
    constructor(properties: ((context: AbilityContext) => PlaceFateRingProperties) | PlaceFateRingProperties) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: PlaceFateRingProperties = this.getProperties(context);
        if(properties.origin) {
            return ['move {1} fate from {2} to {0}', [properties.target, properties.amount, properties.origin]];
        }
        return ['place {1} fate on {0}', [properties.target, properties.amount]];
    }

    canAffect(ring: Ring, context: AbilityContext, additionalProperties = {}): boolean {
        let properties: PlaceFateRingProperties = this.getProperties(context, additionalProperties);
        if(properties.origin && (!properties.origin.checkRestrictions('spendFate', context) || properties.origin.fate === 0)) {
            return false;
        }
        return properties.amount > 0 && super.canAffect(ring, context);
    }

    getEventProperties(event, ring, context, additionalProperties) {
        let { amount, origin } = this.getProperties(context, additionalProperties) as PlaceFateRingProperties;
        event.fate = amount;
        event.origin = origin;
        event.context = context;
        event.recipient = ring;
    }

    checkEventCondition(event, additionalProperties) {
        return this.moveFateEventCondition(event, additionalProperties);
    }

    eventFullyResolved(event, ring, context, additionalProperties) {
        let { amount, origin } = this.getProperties(context, additionalProperties) as PlaceFateRingProperties;
        return !event.cancelled && event.name === this.eventName && 
            event.fate === amount && event.origin === origin && event.recipient === ring;
    }

    eventHandler(event) {
        this.moveFateEventHandler(event);
    }
}
