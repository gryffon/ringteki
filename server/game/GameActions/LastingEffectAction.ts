import { GameAction, GameActionProperties } from './GameAction';
import { Durations, Players, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import { WhenType } from '../Interfaces';

export interface LastingEffectGeneralProperties extends GameActionProperties {
    duration?: Durations;
    condition?: (context: AbilityContext) => boolean;
    until?: WhenType;
    effect: any[];
}

export interface LastingEffectProperties extends LastingEffectGeneralProperties {
    targetController?: Players;
}

export class LastingEffectAction extends GameAction {
    name = 'applyLastingEffect';
    effect = 'apply a lasting effect';
    defaultProperties: LastingEffectProperties = {
        duration: Durations.UntilEndOfConflict,
        effect: []
    };
    
    hasLegalTarget(context: AbilityContext): boolean {
        let properties = this.getProperties(context) as LastingEffectProperties;
        return properties.effect.length > 0;
    }

    addEventsToArray(events: any[], context: AbilityContext): void {
        let properties = this.getProperties(context) as LastingEffectProperties;
        events.push(super.createEvent(EventNames.OnEffectApplied, { context: context }, event => {
            event.context.source[properties.duration](() => properties)
        }));
    }
}
