import { CardGameAction, CardActionProperties } from './CardGameAction';

import BaseCard = require('../basecard');
import AbilityContext = require('../AbilityContext');
import { Locations, CardTypes, EventNames, TokenTypes } from '../Constants';

export interface AddTokenProperties extends CardActionProperties {
    tokenType?: TokenTypes;
}

export class AddTokenAction extends CardGameAction {
    name = 'addToken';
    eventName = EventNames.OnAddTokenToCard;
    defaultProperties: AddTokenProperties = {
        tokenType: TokenTypes.Honor
    };

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: AddTokenProperties = this.getProperties(context) as AddTokenProperties;
        return ['add a {1} token to {0}', [properties.target, properties.tokenType]];
    }

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(card.facedown) {
            return false;
        }
        if([CardTypes.Holding, CardTypes.Province].includes(card.type)) {
            if(!card.location.includes('province')) {
                return false;
            }
        }
        else if(card.location !== Locations.PlayArea) {
            return false;
        }
        return super.canAffect(card, context);
    }

    addPropertiesToEvent(event, card: BaseCard, context: AbilityContext, additionalProperties = {}): void {
        const { tokenType } = this.getProperties(context, additionalProperties) as AddTokenProperties;
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.tokenType = tokenType;
    }

    eventHandler(event): void {
        event.card.addToken(event.tokenType);
    }
}