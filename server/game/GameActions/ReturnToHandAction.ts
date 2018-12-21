import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import Event = require('../Events/Event');
import LeavesPlayEvent = require('../Events/LeavesPlayEvent');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, CardTypes, EventNames }  from '../Constants';

export interface ReturnToHandProperties extends CardActionProperties {
    location?: Locations;
}

export class ReturnToHandAction extends CardGameAction {
    name = 'returnToHand';
    effect = 'return {0} to their hand';
    cost = 'returning {0} to their hand';
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Event];
    defaultProperties: ReturnToHandProperties = { location: Locations.PlayArea };
    constructor(properties: ((context: AbilityContext) => ReturnToHandProperties) | ReturnToHandProperties) {
        super(properties);
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as ReturnToHandProperties;
        if(card.location !== properties.location) {
            return false;
        }
        return super.canAffect(card, context);
    }
    
    getEvent(card: DrawCard, context: AbilityContext, additionalProperties = {}): Event {
        let properties = this.getProperties(context, additionalProperties) as ReturnToHandProperties;
        if(properties.location === Locations.PlayArea) {
            return new LeavesPlayEvent({ context: context, destination: Locations.Hand }, card, this);
        }
        return super.createEvent(EventNames.Unnamed, { card: card, context: context }, () => card.owner.moveCard(card, Locations.Hand));
    }
}