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
    eventName = EventNames.OnResolveRingElement;
    effect = 'resolve {0} effect';
    defaultProperties: ResolveElementProperties = { optional: true };
    constructor(properties: ((context: AbilityContext) => ResolveElementProperties) | ResolveElementProperties) {
        super(properties);
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties: any = {}): void {
        let properties = this.getProperties(context, additionalProperties) as ResolveElementProperties;
        let target = properties.target as Ring[];
        if(target.length > 1) {
            let sortedRings = target.sort((a, b) => {
                let aPriority = RingEffects.contextFor(context.player, a.element).ability.defaultPriority;
                let bPriority = RingEffects.contextFor(context.player, b.element).ability.defaultPriority;
                return context.player.firstPlayer ? aPriority - bPriority : bPriority - aPriority;
            });
            additionalProperties.optional = false;
            let effectObjects = sortedRings.map(ring => ({
                title: RingEffects.getRingName(ring.element) + ' Effect',
                handler: () => context.game.openEventWindow(this.getEvent(ring, context, additionalProperties))
            }));
            events.push(new Event(EventNames.Unnamed, {}, () => context.game.openSimultaneousEffectWindow(effectObjects)));
        } else {
            events.push(this.getEvent(target[0], context, additionalProperties));
        }
    }

    getEventProperties(event, ring, context, additionalProperties) {
        let { physicalRing, optional } = this.getProperties(context, additionalProperties) as ResolveElementProperties;
        super.getEventProperties(event, ring, context, additionalProperties);
        event.player = context.player;
        event.physicalRing = physicalRing;
        event.optional = optional;
    }

    eventHandler(event) {
        event.context.game.resolveAbility(RingEffects.contextFor(event.player, event.ring.element, event.optional));
    }
}
