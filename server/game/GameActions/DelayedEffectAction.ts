import { CardGameAction, CardActionProperties} from './CardGameAction';
import { Locations, EventNames } from '../Constants';
import { WhenType } from '../Interfaces';
import { GameAction } from './GameAction';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import Event = require('../Events/Event');

export interface DelayedEffectActionProperties extends CardActionProperties {
    when: WhenType;
    message: string;
    gameAction: GameAction;
}

export class DelayedEffectAction extends CardGameAction {
    name = 'applyDelayedEffect';
    effect = 'apply a delayed effect to {0}';

    defaultProperties: DelayedEffectActionProperties;
    constructor(properties: DelayedEffectActionProperties | ((context: AbilityContext) => DelayedEffectActionProperties)) {
        super(properties);
    }

    canAffect(card: BaseCard, context: AbilityContext) {
        if(card.location !== Locations.PlayArea) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card: BaseCard, context: AbilityContext, additionalProperties = {}): Event {
        let properties = this.getProperties(context, additionalProperties);
        return super.createEvent(EventNames.OnEffectApplied, { card: card, context: context }, event => {
            event.context.source.delayedEffect(() => Object.assign(properties, { target: card, context: context }));
        });
    }
}
