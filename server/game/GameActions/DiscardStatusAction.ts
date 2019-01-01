import { CardGameAction, CardActionProperties} from './CardGameAction';
import { CardTypes, Locations, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');

export interface DiscardStatusProperties extends CardActionProperties {
}

export class DiscardStatusAction extends CardGameAction {
    name = 'discardStatus';
    eventName = EventNames.OnCardStatusDiscarded;
    effect = 'discard {0}\'s status token';
    targetType = [CardTypes.Character];

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(card.location !== Locations.PlayArea || !card.isHonored && !card.isDishonored) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event): void {
        event.card.isHonored = false;
        event.card.isDishonored = false;
    }
}
