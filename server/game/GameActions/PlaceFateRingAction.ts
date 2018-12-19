import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import Event = require('../Events/Event');
import MoveFateEvent = require('../Events/MoveFateEvent');
import Player = require('../player');
import Ring = require('../ring');
import { RingAction, RingActionProperties} from './RingAction';

export interface PlaceFateRingProperties extends RingActionProperties {
    amount?: number,
    origin?: DrawCard | Player | Ring
}

export class PlaceFateRingAction extends RingAction {
    name = 'placeFate';
    defaultProperties: PlaceFateRingProperties = { amount: 1 };
    constructor(properties: ((context: AbilityContext) => PlaceFateRingProperties) | PlaceFateRingProperties) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: PlaceFateRingProperties = this.getProperties(context);
        if(properties.origin) {
            return ['move {1} fate from {2} to {0}', [properties.amount, properties.origin]];
        }
        return ['place {1} fate on {0}', [properties.amount]];
    }

    canAffect(ring: Ring, context: AbilityContext): boolean {
        let properties: PlaceFateRingProperties = this.getProperties(context);
        if(properties.origin && (!properties.origin.checkRestrictions('spendFate', context) || properties.origin.fate === 0)) {
            return false;
        }
        return properties.amount > 0 && super.canAffect(ring, context);
    }
    
    getEvent(ring: Ring, context: AbilityContext): Event {
        let properties: PlaceFateRingProperties = this.getProperties(context);
        return new MoveFateEvent({ context }, properties.amount, properties.origin, ring, this);
    }
}
