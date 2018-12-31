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
    eventName = EventNames.OnLookAtCards;
    effect = 'look at a facedown card';
    
    canAffect(card: BaseCard, context: AbilityContext) {
        let testLocations = [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour, Locations.StrongholdProvince, Locations.PlayArea];
        if(!card.facedown && testLocations.includes(card.location)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let { target } = this.getProperties(context, additionalProperties);
        let cards = (target as BaseCard[]).filter(card => this.canAffect(card, context));
        if(cards.length === 0) {
            return
        }
        let event = this.createEvent();
        this.updateEvent(event, cards, context, additionalProperties);
        events.push(event);
    }

    getEventProperties(event, cards, context, additionalProperties) {
        if(!cards) {
            cards = this.getProperties(context, additionalProperties).target;
        }
        if(!Array.isArray(cards)) {
            cards = [cards];
        }
        event.cards = cards;
        event.context = context;
    }

    eventHandler(event) {
        let context = event.context;
        context.game.addMessage('{0} sees {1}', context.source, event.cards);
    }

    eventFullyResolved(event) {
        return !event.cancelled && event.name === this.eventName;
    }

    checkEventCondition() {
        return true;
    }
}
