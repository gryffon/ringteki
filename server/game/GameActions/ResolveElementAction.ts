import AbilityContext = require('../AbilityContext');
import Event = require('../Events/Event');
import Player = require('../player');
import RingEffects = require('../RingEffects');
import Ring = require('../ring');
import { RingAction, RingActionProperties} from './RingAction';
import { EventNames } from '../Constants';

export interface ResolveElementProperties extends RingActionProperties {
    optional?: boolean;
    physicalRing?: Ring;
    player?: Player;
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

    addPropertiesToEvent(event, ring: Ring, context: AbilityContext, additionalProperties): void {
        let { physicalRing, optional, player } = this.getProperties(context, additionalProperties) as ResolveElementProperties;
        super.addPropertiesToEvent(event, ring, context, additionalProperties);
        event.player = player || context.player;
        event.physicalRing = physicalRing;
        event.optional = optional;
    }

    eventHandler(event): void {
        event.context.game.resolveAbility(RingEffects.contextFor(event.player, event.ring.element, event.optional));
    }
}
