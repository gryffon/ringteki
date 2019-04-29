import { CardGameAction, CardActionProperties} from './CardGameAction';
import { Locations, EventNames, CardTypes } from '../Constants';
import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');

export interface DiscardCardProperties extends CardActionProperties {
}

export class DiscardCardAction extends CardGameAction {
    name = 'discardCard';
    eventName = EventNames.OnCardsDiscarded;
    cost = 'discarding {0}';
    effect = 'discard {0}';
    targetType = [CardTypes.Attachment, CardTypes.Character, CardTypes.Event, CardTypes.Holding];

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        return (card.location !== Locations.Hand || card.controller.checkRestrictions('discard', context)) && 
            super.canAffect(card, context, additionalProperties);
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let { target } = this.getProperties(context, additionalProperties);
        let cards = (target as DrawCard[]).filter(card => this.canAffect(card, context));
        if(cards.length === 0) {
            return
        }
        let event = this.createEvent(null, context, additionalProperties);
        this.updateEvent(event, cards, context, additionalProperties);
        events.push(event);
    }

    addPropertiesToEvent(event, cards, context: AbilityContext, additionalProperties): void {
        if(!cards) {
            cards = this.getProperties(context, additionalProperties).target;
        }
        if(!Array.isArray(cards)) {
            cards = [cards];
        }
        event.cards = cards;
        event.context = context;
    }

    eventHandler(event): void {
        for(const card of event.cards) {
            if(card.location.includes('province')) {
                event.context.refillProvince(card.controller, card.location);
            }
            card.controller.moveCard(card, card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
        }
    }

    isEventFullyResolved(event): boolean {
        return !event.cancelled && event.name === this.eventName;
    }

    checkEventCondition(): boolean {
        return true;
    }
}
