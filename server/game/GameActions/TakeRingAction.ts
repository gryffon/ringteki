import AbilityContext = require('../AbilityContext');
import Ring = require('../ring');
import { RingAction, RingActionProperties} from './RingAction';
import { EventNames } from '../Constants';

export interface TakeRingProperties extends RingActionProperties {
    takeFate?: boolean,
}

export class TakeRingAction extends RingAction {
    name = 'takeFate';
    eventName = EventNames.OnTakeRing;
    effect = 'take {0}';
    defaultProperties: TakeRingProperties = { takeFate: true };
    constructor(properties: ((context: AbilityContext) => TakeRingProperties) | TakeRingProperties) {
        super(properties);
    }

    canAffect(ring: Ring, context: AbilityContext): boolean {
        return ring.claimedBy !== context.player.name && super.canAffect(ring, context);
    }

    eventHandler(event, additionalProperties): void {
        let { takeFate } = this.getProperties(event.context, additionalProperties) as TakeRingProperties;
        let ring = event.ring;
        let context = event.context;
        ring.claimRing(context.player);
        ring.contested = false;
        if(takeFate && context.player.checkRestrictions('takeFateFromRings', context)) {
            context.game.addMessage('{0} takes {1} fate from {2}', context.player, ring.fate, ring);
            context.player.modifyFate(ring.fate);
            ring.removeFate();
        }

    }
}
