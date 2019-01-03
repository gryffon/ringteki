import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import Player = require('../player');
import Ring = require('../ring');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, CardTypes, EventNames }  from '../Constants';
import abilitylimit from '../abilitylimit';

export interface PlaceFateProperties extends CardActionProperties {
    amount?: number,
    origin?: DrawCard | Player | Ring
}

export class PlaceFateAction extends CardGameAction {
    name = 'placeFate';
    eventName = EventNames.OnMoveFate;
    targetType = [CardTypes.Character];
    defaultProperties: PlaceFateProperties = { amount: 1 };
    constructor(properties: ((context: AbilityContext) => PlaceFateProperties) | PlaceFateProperties) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let { amount, target } = this.getProperties(context) as PlaceFateProperties;
        return ['place {1} fate on {0}', [target, amount]];
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        let { amount, origin } = this.getProperties(context, additionalProperties) as PlaceFateProperties;
        if(amount === 0 || card.location !== Locations.PlayArea) {
            return false;
        }
        return super.canAffect(card, context) && this.checkOrigin(origin, context);
    }

    checkOrigin(origin: Player | Ring | DrawCard, context: AbilityContext): boolean {
        if(origin) {
            if(origin.fate === 0) {
                return false;
            } else if(['player', 'ring'].includes(origin.type)) {
                return true;
            }
            return origin.allowGameAction('removeFate', context);
        }
        return true;
    }

    addPropertiesToEvent(event, card: DrawCard, context: AbilityContext, additionalProperties): void {
        let { amount, origin } = this.getProperties(context, additionalProperties) as PlaceFateProperties;
        event.fate = amount;
        event.origin = origin;
        event.context = context;
        event.recipient = card;
    }

    checkEventCondition(event): boolean {
        return this.moveFateEventCondition(event);
    }

    isEventFullyResolved(event, card: DrawCard, context: AbilityContext, additionalProperties): boolean {
        let { amount, origin } = this.getProperties(context, additionalProperties) as PlaceFateProperties;
        return !event.cancelled && event.name === this.eventName && 
            event.fate === amount && event.origin === origin && event.recipient === card;
    }

    eventHandler(event): void {
        this.moveFateEventHandler(event);
    }
}
