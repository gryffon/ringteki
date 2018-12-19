import { CardGameAction, CardActionProperties} from './CardGameAction';
import { Locations, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import Event = require('../Events/Event');
import GameObject = require('../GameObject');

export interface LookAtProperties extends CardActionProperties {
}

export class LookAtAction extends CardGameAction {
    name = 'lookAt';
    effect = 'look at a facedown card';
    
    canAffect(card: BaseCard, context: AbilityContext) {
        let testLocations = [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour, Locations.StrongholdProvince, Locations.PlayArea];
        if(!card.facedown && testLocations.includes(card.location)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    addEventsToArray(events: any[], context: AbilityContext): void {
        let properties = this.getProperties(context);
        if((properties.target as GameObject[]).length === 0) {
            return
        }
        events.push(this.createEvent(EventNames.OnLookAtCards, { cards: properties.target, context: context }, event => {
            context.game.addMessage('{0} sees {1}', context.source, event.cards);
        }));
    }

    getEvent(card: BaseCard, context: AbilityContext): Event {
        return super.createEvent(EventNames.OnLookAtCards, { card: card, context: context }, () => {
            context.game.addMessage('{0} sees {1}', context.source, card);
        });
    }

    checkEventCondition() {
        return true;
    }

    fullyResolved() {
        return true;
    }
}
