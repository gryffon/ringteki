import { CardGameAction, CardActionProperties} from './CardGameAction';
import { CardTypes, Locations, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import Event = require('../Events/Event');

export interface DishonorProperties extends CardActionProperties {
}

export class DishonorAction extends CardGameAction {
    name = 'dishonor';
    eventName = EventNames.OnCardDishonored;
    targetType = [CardTypes.Character];
    cost = 'dishonoring {0}';
    effect = 'dishonor {0}';

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(card.location !== Locations.PlayArea || card.type !== CardTypes.Character || card.isDishonored) {
            return false;
        } else if(!card.isHonored && !card.checkRestrictions('becomeDishonored', context)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event) {
        event.card.dishonor()
    }
}
