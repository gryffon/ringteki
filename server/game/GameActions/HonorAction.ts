import { CardGameAction, CardActionProperties} from './CardGameAction';
import { CardTypes, Locations, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');

export interface HonorProperties extends CardActionProperties {
}

export class HonorAction extends CardGameAction {
    name = 'honor';
    eventName = EventNames.OnCardHonored;
    targetType = [CardTypes.Character];
    cost = 'honoring {0}';
    effect = 'honor {0}';

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(card.location !== Locations.PlayArea || card.type !== CardTypes.Character || card.isHonored) {
            return false;
        } else if(!card.isDishonored && !card.checkRestrictions('receiveHonorToken', context)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event): void {
        event.card.honor();
    }
}
