import { RingAction } from './RingAction';
import { Durations, EventNames } from '../Constants';
import { LastingEffectGeneralProperties } from './LastingEffectAction';
import AbilityContext = require('../AbilityContext');
import Event = require('../Events/Event');
import Ring = require('../ring');

export interface LastingEffectRingProperties extends LastingEffectGeneralProperties {
}

export class LastingEffectRingAction extends RingAction {
    name = 'applyLastingEffect';
    eventName = EventNames.OnEffectApplied;
    effect = 'apply a lasting effect';
    defaultProperties: LastingEffectRingProperties = {
        duration: Durations.UntilEndOfConflict,
        effect: []
    };

    eventHandler(event, additionalProperties) {
        let properties = this.getProperties(event.context, additionalProperties) as LastingEffectRingProperties;
        event.context.source[properties.duration](() => Object.assign({ match: event.ring }, properties));
    }
}
