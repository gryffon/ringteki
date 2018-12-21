import { CardGameAction, CardActionProperties} from './CardGameAction';
import { Locations, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import GameObject = require('../GameObject');
import Event = require('../Events/Event');

export interface DiscardCardProperties extends CardActionProperties {
}

export class DiscardCardAction extends CardGameAction {
    name = 'discardCard';
    cost = 'discarding {0}';
    effect = 'discard {0}';

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        if((properties.target as GameObject[]).length === 0 ) {
            return;
        }
        events.push(this.createEvent(EventNames.OnCardsDiscarded, { player: properties.target[0].controller, cards: properties.target, context: context }, event => {
            for(const card of event.cards) {
                if(card.location.includes('province')) {
                    event.context.refillProvince(card.controller, card.location);
                }
                card.controller.moveCard(card, card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
            }
        }));
    }

    getEvent(card: BaseCard, context: AbilityContext): Event {
        return super.createEvent(EventNames.OnCardsDiscarded, { player: card.controller, cards: [card], context: context }, event => {
            if(card.location.includes('province')) {
                event.context.refillProvince(card.controller, card.location);
            }
            card.controller.moveCard(card, card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
        });
    }

    checkEventCondition() {
        return true;
    }

    fullyResolved() {
        return true;
    }
}
