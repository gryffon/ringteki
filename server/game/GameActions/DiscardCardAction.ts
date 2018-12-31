import { CardGameAction, CardActionProperties} from './CardGameAction';
import { Locations, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import Event = require('../Events/Event');

export interface DiscardCardProperties extends CardActionProperties {
}

export class DiscardCardAction extends CardGameAction {
    name = 'discardCard';
    eventName = EventNames.OnCardsDiscarded;
    cost = 'discarding {0}';
    effect = 'discard {0}';

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
        for(const card of event.cards) {
            if(card.location.includes('province')) {
                event.context.refillProvince(card.controller, card.location);
            }
            card.controller.moveCard(card, card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
        }
    }

    eventFullyResolved(event) {
        return !event.cancelled && event.name === this.eventName;
    }

    checkEventCondition() {
        return true;
    }
}
