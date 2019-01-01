import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import DrawCard = require('../drawcard');
import Player = require('../player');
import Ring = require('../ring');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, CardTypes, EventNames }  from '../Constants';

export interface RemoveFateProperties extends CardActionProperties {
    amount?: number,
    recipient?: DrawCard | Player | Ring
}

export class RemoveFateAction extends CardGameAction {
    name = 'removeFate';
    eventName = EventNames.OnMoveFate;
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
        return ['remove {1} fate from {0}', [properties.target, properties.amount]];
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

    addPropertiesToEvent(event, card: DrawCard, context: AbilityContext, additionalProperties): void {
        let { amount, recipient } = this.getProperties(context, additionalProperties) as RemoveFateProperties;
        event.fate = amount;
        event.recipient = recipient;
        event.origin = card;
        event.context = context;
    }

    checkEventCondition(event): boolean {
        return this.moveFateEventCondition(event);
    }

    isEventFullyResolved(event, card: DrawCard, context: AbilityContext, additionalProperties): boolean {
        let { amount, recipient } = this.getProperties(context, additionalProperties) as RemoveFateProperties;
        return !event.cancelled && event.name === this.eventName && 
            event.fate === amount && event.origin === card && event.recipient === recipient;
    }
    
    eventHandler(event): void {
        this.moveFateEventHandler(event);
    }
}
