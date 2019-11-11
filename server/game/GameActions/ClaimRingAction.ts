import AbilityContext = require('../AbilityContext');
import Ring = require('../ring');
import { RingAction, RingActionProperties} from './RingAction';
import { EventNames, ConflictTypes} from '../Constants';

export interface ClaimRingProperties extends RingActionProperties {
    takeFate?: boolean,
    type?: string,
}

export class ClaimRingAction extends RingAction {
    name = 'claimRing';
    eventName = EventNames.OnClaimRing;
    effect = 'claim {0}';
    defaultProperties: ClaimRingProperties = { takeFate: true, type: ConflictTypes.Military };
    constructor(properties: ((context: AbilityContext) => ClaimRingProperties) | ClaimRingProperties) {
        super(properties);
    }

    canAffect(ring: Ring, context: AbilityContext): boolean {
        return ring.claimedBy !== context.player.name && super.canAffect(ring, context);
    }

    eventHandler(event, additionalProperties): void {
        let { takeFate, type } = this.getProperties(event.context, additionalProperties) as ClaimRingProperties;
        let ring = event.ring;
        let context = event.context;
        ring.contested = false;
        ring.conflictType = type;
        if(takeFate && context.player.checkRestrictions('takeFateFromRings', context)) {
            context.game.addMessage('{0} takes {1} fate from {2}', context.player, ring.fate, ring);
            context.player.modifyFate(ring.fate);
            ring.removeFate();
        }
        context.game.raiseEvent(EventNames.OnClaimRing, { player: context.player, conflict: context.conflict, ring:ring }, () => ring.claimRing(context.player));
    }
}

