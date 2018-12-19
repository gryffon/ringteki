import { CardGameAction, CardActionProperties} from './CardGameAction';
import { CardTypes, Locations, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import Event = require('../Events/Event');

export interface HonorProperties extends CardActionProperties {
}

export class HonorAction extends CardGameAction {
    name = 'honor';
    targetType = [CardTypes.Character];
    cost = 'honoring {0}';
    effect = 'honor {0}';

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(card.location !== Locations.PlayArea || card.type !== CardTypes.Character || card.isHonored) {
            return false;
        } else if(!card.isDishonored && !card.checkRestrictions('becomeHonored', context)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card: BaseCard, context: AbilityContext): Event {
        return super.createEvent(EventNames.OnCardHonored, { card, context }, event => event.card.honor());
    }
}
