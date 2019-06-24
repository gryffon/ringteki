import { CardGameAction, CardActionProperties} from './CardGameAction';
import { Locations, EventNames } from '../Constants';
import { WhenType } from '../Interfaces';
import { GameAction } from './GameAction';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');

export interface DelayedEffectActionProperties extends CardActionProperties {
    when: WhenType;
    message: string;
    gameAction: GameAction;
    location?: Locations | Locations[];
}

export class DelayedEffectAction extends CardGameAction {
    name = 'applyDelayedEffect';
    eventName = EventNames.OnEffectApplied;
    effect = 'apply a delayed effect to {0}';

    defaultProperties: DelayedEffectActionProperties = {
        when: null,
        message: null,
        gameAction: null,
        location: Locations.PlayArea
    };

    constructor(properties: DelayedEffectActionProperties | ((context: AbilityContext) => DelayedEffectActionProperties)) {
        super(properties);
    }

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as DelayedEffectActionProperties;
        let inLocation = Array.isArray(properties.location) ? properties.location.includes(card.location) : properties.location === card.location;
        if(!inLocation) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event, additionalProperties): void {
        let properties = this.getProperties(event.context, additionalProperties);
        event.context.source.delayedEffect(() => Object.assign(properties, { target: event.card, context: event.context }));
    }
}
