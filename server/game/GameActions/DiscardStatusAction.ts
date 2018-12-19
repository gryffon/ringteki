import { CardGameAction, CardActionProperties} from './CardGameAction';
import { CardTypes, Locations, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import Event = require('../Events/Event');

export interface DiscardStatusProperties extends CardActionProperties {
}

export class DiscardStatusAction extends CardGameAction {
    name = 'discardStatus';
    effect = 'discard {0}\'s status token';
    targetType = [CardTypes.Character];

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(card.location !== Locations.PlayArea || !card.isHonored && !card.isDishonored) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card: BaseCard, context: AbilityContext): Event {
        return super.createEvent(EventNames.OnCardStatusDiscarded, { card: card, context: context }, () => {
            card.isHonored = false;
            card.isDishonored = false;
        });
    }
}
