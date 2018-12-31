import { CardGameAction, CardActionProperties } from './CardGameAction';
import { CardTypes, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');

export interface BreakProperties extends CardActionProperties {
}

export class BreakAction extends CardGameAction {
    name = 'break';
    eventName = EventNames.OnBreakProvince;
    targetType = [CardTypes.Province];
    cost = 'breaking {0}';
    effect = 'break {0}';

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(!card.isProvince || card.isBroken) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEventProperties(event, card, context, additionalProperties) {
        super.getEventProperties(event, card, context, additionalProperties);
        event.conflict = context.game.currentConflict;
    }

    eventHandler(event) {
        event.card.breakProvince();
    }
}
