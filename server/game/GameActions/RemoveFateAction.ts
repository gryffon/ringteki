import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import DrawCard = require('../drawcard');
import Event = require('../Events/Event');
import MoveFateEvent = require('../Events/MoveFateEvent');
import Player = require('../player');
import Ring = require('../ring');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, CardTypes }  from '../Constants';

export interface RemoveFateProperties extends CardActionProperties {
    amount?: number,
    recipient?: DrawCard | Player | Ring
}

export class RemoveFateAction extends CardGameAction {
    name = 'removeFate';
    targetType = [CardTypes.Character];
    defaultProperties: RemoveFateProperties = { amount: 1 };
    constructor(properties: ((context: AbilityContext) => RemoveFateProperties) | RemoveFateProperties) {
        super(properties);
    }

    getCostMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as RemoveFateProperties;
        return ['removing {1} fate from {0}', [properties.amount]];
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as RemoveFateProperties;
        return ['remove {1} fate from {0}', [properties.amount]];
    }

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as RemoveFateProperties;
        if(properties.amount === 0 || card.location !== Locations.PlayArea || card.fate === 0) {
            return false;
        }
        return super.canAffect(card, context) && this.checkRecipient(properties.recipient, context);
    }

    checkRecipient(origin: Player | Ring | DrawCard, context: AbilityContext): boolean {
        if(origin) {
            if(['player', 'ring'].includes(origin.type)) {
                return true;
            }
            return origin.allowGameAction('placeFate', context);
        }
        return true;
    }
    
    getEvent(card: BaseCard, context: AbilityContext, additionalProperties = {}): Event {
        let properties = this.getProperties(context, additionalProperties) as RemoveFateProperties;
        return new MoveFateEvent({ context: context }, properties.amount, card, properties.recipient, this);
    }
}
