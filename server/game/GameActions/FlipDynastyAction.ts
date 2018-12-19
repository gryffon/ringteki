import { CardGameAction, CardActionProperties} from './CardGameAction';
import { CardTypes, Locations, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import Event = require('../Events/Event');

export interface FlipDynastyProperties extends CardActionProperties {
}

export class FlipDynastyAction extends CardGameAction {
    name = 'reveal';
    targetType = [CardTypes.Character, CardTypes.Holding];
    
    getEffectMessage(context): [string, any[]] {
        let properties = this.getProperties(context);
        return ['reveal the facedown card in {1}', [properties.target[0].location]];
    }

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if([Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour].includes(card.location) && card.isDynasty && card.facedown) {
            return super.canAffect(card, context);
        }
        return false;
    }

    getEvent(card: BaseCard, context: AbilityContext): Event {
        return super.createEvent(EventNames.OnDynastyCardTurnedFaceup, { card: card, context: context }, () => {
            card.facedown = false;
        });
    }
}

module.exports = FlipDynastyAction;
