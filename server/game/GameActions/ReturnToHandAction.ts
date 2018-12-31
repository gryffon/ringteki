import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, CardTypes, EventNames }  from '../Constants';

export interface ReturnToHandProperties extends CardActionProperties {
}

export class ReturnToHandAction extends CardGameAction {
    name = 'returnToHand';
    eventName = EventNames.OnCardLeavesPlay;
    effect = 'return {0} to their hand';
    cost = 'returning {0} to their hand';
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Event];

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        return card.location === Locations.PlayArea && super.canAffect(card, context, additionalProperties);
    }

    updateEvent(event, card, context, additionalProperties) {
        this.updateLeavesPlayEvent(event, card, context, additionalProperties);
        event.destination = Locations.Hand;
    }

    eventHandler(event) {
        this.leavesPlayEventHandler(event);
    }
}