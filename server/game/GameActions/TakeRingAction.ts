import AbilityContext = require('../AbilityContext');
import Event = require('../Events/Event');
import Ring = require('../ring');
import { RingAction, RingActionProperties} from './RingAction';
import { EventNames } from '../Constants';

export interface TakeRingProperties extends RingActionProperties {
    takeFate?: boolean,
}

export class TakeRingAction extends RingAction {
    name = 'takeFate';
    effect = 'take {0}';
    defaultProperties: TakeRingProperties = { takeFate: true };
    constructor(properties: ((context: AbilityContext) => TakeRingProperties) | TakeRingProperties) {
        super(properties);
    }

    canAffect(ring: Ring, context: AbilityContext): boolean {
        return ring.claimedBy !== context.player.name && super.canAffect(ring, context);
    }
    
    getEvent(ring: Ring, context: AbilityContext): Event {
        let properties = this.getProperties(context) as TakeRingProperties;
        return this.createEvent(EventNames.OnTakeRing, { ring: ring, context: context }, () => {
            ring.claimRing(context.player);
            ring.contested = false;
            if(properties.takeFate && context.player.checkRestrictions('takeFateFromRings', context)) {
                context.game.addMessage('{0} takes {1} fate from {2}', context.player, ring.fate, ring);
                context.player.modifyFate(ring.fate);
                ring.removeFate();
            }
        });
    }
}
