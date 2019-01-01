import AbilityContext = require("../AbilityContext");
import BaseCard = require('../basecard');

import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, CardTypes, EventNames } from '../Constants';

export interface DiscardFromPlayProperties extends CardActionProperties {
}

export class DiscardFromPlayAction extends CardGameAction {
    name = 'discardFromPlay';
    eventName = EventNames.OnCardLeavesPlay;
    cost = 'sacrificing {0}';
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Holding];

    constructor(propertyFactory, isSacrifice = false) {
        super(propertyFactory);
        if(isSacrifice) {
            this.name = 'sacrifice';
        }
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context);
        return[this.name === 'sacrifice' ? 'sacrifice {0}' : 'discard {0}', [properties.target]];
    }

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(card.type === CardTypes.Holding) {
            if(!card.location.includes('province')) {
                return false;
            }
        } else if(card.location !== Locations.PlayArea) {
            return false;
        }
        return super.canAffect(card, context);
    }

    updateEvent(event, card: BaseCard, context: AbilityContext, additionalProperties): void {
        this.updateLeavesPlayEvent(event, card, context, additionalProperties);
    }

    eventHandler(event): void {
        this.leavesPlayEventHandler(event);
    }
}
