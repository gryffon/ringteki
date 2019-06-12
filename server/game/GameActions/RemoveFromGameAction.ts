import AbilityContext = require("../AbilityContext");
import BaseCard = require('../basecard');

import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, CardTypes, EventNames } from '../Constants';

export interface RemoveFromGameProperties extends CardActionProperties {
    location?: Locations
}

export class RemoveFromGameAction extends CardGameAction {
    name = 'removeFromGame';
    eventName = EventNames.OnCardLeavesPlay;
    cost = 'removing {0} from the game';
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Holding];
    effect = 'remove {0} from the game'

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties): boolean {
        let properties = this.getProperties(context, additionalProperties) as RemoveFromGameProperties;
        if(properties.location) {
            if(properties.location !== card.location) {
                return false;
            }
        }
        else {
            if(card.type === CardTypes.Holding) {
                if(!card.location.includes('province')) {
                    return false;
                }
            } else if(card.location !== Locations.PlayArea) {
                return false;
            }
        }
        return super.canAffect(card, context);
    }

    updateEvent(event, card: BaseCard, context: AbilityContext, additionalProperties): void {
        additionalProperties.destination = Locations.RemovedFromGame;
        this.updateLeavesPlayEvent(event, card, context, additionalProperties);
    }

    eventHandler(event, additionalProperties = {}): void {
        this.leavesPlayEventHandler(event, additionalProperties);
    }
}
