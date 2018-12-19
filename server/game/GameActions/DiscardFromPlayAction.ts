import AbilityContext = require("../AbilityContext");
import BaseCard = require('../basecard');
import LeavesPlayEvent = require('../Events/LeavesPlayEvent');

import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, CardTypes } from '../Constants';

export interface DiscardFromPlayProperties extends CardActionProperties {
}

export class DiscardFromPlayAction extends CardGameAction {
    name = 'discardFromPlay';
    cost = 'sacrificing {0}';
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Holding];

    constructor(propertyFactory, isSacrifice = false) {
        super(propertyFactory);
        if(isSacrifice) {
            this.name = 'sacrifice';
        }
    }

    getEffectMessage(): [string, any[]] {
        return[this.name === 'sacrifice' ? 'sacrifice {0}' : 'discard {0}', []];
    }

    canAffect(card: BaseCard, context: AbilityContext) {
        if(card.type === CardTypes.Holding) {
            if(!card.location.includes('province')) {
                return false;
            }
        } else if(card.location !== Locations.PlayArea) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card: BaseCard, context: AbilityContext): LeavesPlayEvent {
        return new LeavesPlayEvent({ context: context }, card, this);
    }
}
