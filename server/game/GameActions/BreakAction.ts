import { CardGameAction, CardActionProperties } from './CardGameAction';
import { CardTypes, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import Event = require('../Events/Event');

export interface BreakProperties extends CardActionProperties {
}

export class BreakAction extends CardGameAction {
    name = 'break';
    targetType = [CardTypes.Province];
    cost = 'breaking {0}';
    effect = 'break {0}';

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(!card.isProvince || card.isBroken) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card: BaseCard, context: AbilityContext): Event {
        let params = { conflict: context.game.currentConflict, card: card, context: context };
        return super.createEvent(EventNames.OnBreakProvince, params, () => card.breakProvince());
    }
}
