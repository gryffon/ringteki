import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import DrawCard = require('../drawcard');
import Event = require('../Events/Event');
import MoveFateEvent = require('../Events/MoveFateEvent');
import Player = require('../player');
import Ring = require('../ring');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, CardTypes }  from '../Constants';

export interface PlaceFateProperties extends CardActionProperties {
    amount?: number,
    origin?: DrawCard | Player | Ring
}

export class PlaceFateAction extends CardGameAction {
    name = 'placeFate';
    targetType = [CardTypes.Character];
    defaultProperties: PlaceFateProperties = { amount: 1 };
    constructor(properties: ((context: AbilityContext) => PlaceFateProperties) | PlaceFateProperties) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let { amount } = this.getProperties(context) as PlaceFateProperties;
        return ['place {1} fate on {0}', [amount]];
    }

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties = {}): boolean {
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
    
    getEvent(card: BaseCard, context: AbilityContext, additionalProperties = {}): Event {
        let { amount, origin } = this.getProperties(context, additionalProperties) as PlaceFateProperties;
        return new MoveFateEvent({ context: context }, amount, origin, card, this);
    }
}
