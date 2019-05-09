import { LastingEffectCardAction, LastingEffectCardProperties } from './LastingEffectCardAction';
import { GameActionProperties } from './GameAction';
import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import Effects = require('../effects');
import { Durations } from '../Constants';
import { WhenType } from '../Interfaces';

export interface TakeControlProperties extends GameActionProperties {
    duration?: Durations;
    until?: WhenType;
    effect?: any;
}

export class TakeControlAction extends LastingEffectCardAction {
    name = 'takeControl';
    effect = 'take control of {0}';
    defaultProperties: LastingEffectCardProperties = {
        duration: Durations.Custom,
        effect: null
    }

    constructor(properties: ((context: AbilityContext) => TakeControlProperties) | TakeControlProperties) {
        super(properties as LastingEffectCardProperties);
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        return !card.anotherUniqueInPlay(context.player) && super.canAffect(card, context, additionalProperties);
    }

    eventHandler(event, additionalProperties): void {
        let properties = this.getProperties(event.context, additionalProperties);
        event.context.source[properties.duration](() => Object.assign({ match: event.card, effect: Effects.takeControl(event.context.player) }, properties));
    }
}