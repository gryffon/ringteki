import AbilityContext = require('../AbilityContext');
import Event = require('../Events/Event');
import RingEffects = require('../RingEffects');
import Ring = require('../ring');
import { RingAction, RingActionProperties} from './RingAction';
import { EventNames } from '../Constants';

export interface ResolveElementProperties extends RingActionProperties {
    optional?: boolean;
    physicalRing: Ring;
}

export class ResolveElementAction extends RingAction {
    name = 'resolveElement';
    effect = 'resolve {0} effect';
    defaultProperties: ResolveElementProperties = { 
        optional: true,
        physicalRing: null
    };
    constructor(properties: ((context: AbilityContext) => ResolveElementProperties) | ResolveElementProperties) {
        super(properties);
    }

    addEventsToArray(events: any[], context: AbilityContext): void {
        let properties = this.getProperties(context) as ResolveElementProperties;
        let target = properties.target as Ring[];
        if(target.length > 1) {
            let sortedRings = target.sort((a, b) => {
                let aPriority = RingEffects.contextFor(context.player, a.element).ability.defaultPriority;
                let bPriority = RingEffects.contextFor(context.player, b.element).ability.defaultPriority;
                return context.player.firstPlayer ? aPriority - bPriority : bPriority - aPriority;
            });
            let effectObjects = sortedRings.map(ring => ({
                title: RingEffects.getRingName(ring.element) + ' Effect',
                handler: () => context.game.openEventWindow(this.getResolveElementEvent(ring, context, false))
            }));
            events.push(this.createEvent(EventNames.Unnamed, {}, () => context.game.openSimultaneousEffectWindow(effectObjects)));
        }
    }

    getResolveElementEvent(ring: Ring, context: AbilityContext, optional: boolean): Event {
        let properties = this.getProperties(context) as ResolveElementProperties;
        let physicalRing = properties.physicalRing;
        let player = context.player;
        return this.createEvent(EventNames.OnResolveRingElement, { ring, player, context, physicalRing, optional }, () => {
            context.game.resolveAbility(RingEffects.contextFor(context.player, ring.element, optional));
        });
    }
    
    getEvent(ring: Ring, context: AbilityContext): Event {
        let properties = this.getProperties(context) as ResolveElementProperties;
        return this.getResolveElementEvent(ring, context, properties.optional);
    }
}
