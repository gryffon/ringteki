import { CardGameAction, CardActionProperties} from './CardGameAction';
import { CardTypes, Locations, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');

export interface FlipDynastyProperties extends CardActionProperties {
}

export class FlipDynastyAction extends CardGameAction {
    name = 'reveal';
    eventName = EventNames.OnDynastyCardTurnedFaceup;
    targetType = [CardTypes.Character, CardTypes.Holding];
    
    getEffectMessage(context): [string, any[]] {
        let properties = this.getProperties(context);
        return ['reveal the facedown card in {0}', [properties.target[0].location]];
    }

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if([Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour].includes(card.location) && card.isDynasty && card.facedown) {
            return super.canAffect(card, context);
        }
        return false;
    }

    eventHandler(event): void {
        event.card.facedown = false;
    }
}
