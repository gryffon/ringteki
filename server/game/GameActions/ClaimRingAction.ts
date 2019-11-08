import AbilityContext = require('../AbilityContext');
import Ring = require('../ring');
import { RingAction, RingActionProperties} from './RingAction';
import { EventNames, ConflictTypes} from '../Constants';

export interface ClaimRingProperties extends RingActionProperties {
    takeFate?: boolean,
    type?: string,
}

export class ClaimRingAction extends RingAction {
    name = 'takeFate';
    eventName = EventNames.OnClaimRing;
    effect = 'take {0}';
    defaultProperties: ClaimRingProperties = { takeFate: true, type: ConflictTypes.Military };
    constructor(properties: ((context: AbilityContext) => ClaimRingProperties) | ClaimRingProperties) {
        super(properties);
    }

    canAffect(ring: Ring, context: AbilityContext): boolean {
        return ring.claimedBy !== context.player.name && super.canAffect(ring, context);
    }

    eventHandler(event, additionalProperties): void {
        let { takeFate } = this.getProperties(event.context, additionalProperties) as ClaimRingProperties;
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

