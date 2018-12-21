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
    effect = 'apply a lasting effect';
    defaultProperties: LastingEffectRingProperties = {
        duration: Durations.UntilEndOfConflict,
        effect: []
    };

    getEvent(ring: Ring, context: AbilityContext, additionalProperties = {}): Event {
        let properties = this.getProperties(context, additionalProperties) as LastingEffectRingProperties;
        return super.createEvent(EventNames.OnEffectApplied, { ring, context }, event => {
            event.context.source[properties.duration](() => Object.assign({ match: ring }, properties));
        });
    }
}
