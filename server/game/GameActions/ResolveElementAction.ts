import AbilityContext = require('../AbilityContext');
import Event = require('../Events/Event');
import RingEffects = require('../RingEffects');
import Ring = require('../ring');
import { RingAction, RingActionProperties} from './RingAction';
import { EventNames } from '../Constants';

export interface ResolveElementProperties extends RingActionProperties {
    optional?: boolean;
    physicalRing?: Ring;
}

export class ResolveElementAction extends RingAction {
    name = 'resolveElement';
    effect = 'resolve {0} effect';
    defaultProperties: ResolveElementProperties = { optional: true };
    constructor(properties: ((context: AbilityContext) => ResolveElementProperties) | ResolveElementProperties) {
        super(properties);
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties) as ResolveElementProperties;
        let target = properties.target as Ring[];
        if(target.length > 1) {
            let sortedRings = target.sort((a, b) => {
                let aPriority = RingEffects.contextFor(context.player, a.element).ability.defaultPriority;
                let bPriority = RingEffects.contextFor(context.player, b.element).ability.defaultPriority;
                return context.player.firstPlayer ? aPriority - bPriority : bPriority - aPriority;
            });
            let effectObjects = sortedRings.map(ring => ({
                title: RingEffects.getRingName(ring.element) + ' Effect',
                handler: () => context.game.openEventWindow(this.getResolveElementEvent(ring, context, properties, false))
            }));
            events.push(this.createEvent(EventNames.Unnamed, {}, () => context.game.openSimultaneousEffectWindow(effectObjects)));
        } else {
            events.push(this.getEvent(target[0], context, additionalProperties));
        }
    }

    getResolveElementEvent(ring: Ring, context: AbilityContext, properties, optional: boolean): Event {
        let physicalRing = properties.physicalRing || ring;
        let player = context.player;
        return this.createEvent(EventNames.OnResolveRingElement, { ring, player, context, physicalRing, optional }, () => {
            context.game.resolveAbility(RingEffects.contextFor(context.player, ring.element, optional));
        });
    }
    
    getEvent(ring: Ring, context: AbilityContext, additionalProperties = {}): Event {
        let properties = this.getProperties(context, additionalProperties) as ResolveElementProperties;
        return this.getResolveElementEvent(ring, context, properties, properties.optional);
    }
}
