import { TokenAction, TokenActionProperties} from './TokenAction';
import StatusToken = require('../StatusToken');
import DrawCard = require('../DrawCard');
import AbilityContext = require('../AbilityContext');
import { EventNames } from '../Constants';
import { SelectCardProperties } from './SelectCardAction';
import MetaActionCost = require('../costs/MetaActionCost');

export interface DiscardStatusProperties extends TokenActionProperties {
}

export class DiscardStatusAction extends TokenAction {
    name = 'discardStatus';
    eventName = EventNames.OnStatusTokenDiscarded;

    getEffectMessage(context: AbilityContext, additionalProperties = {}): [string, any[]] {
        let properties = this.getProperties(context,additionalProperties) as DiscardStatusProperties;
        let target = (Array.isArray(properties.target) ? properties.target[0] : properties.target) as StatusToken;
        return ['discard {1}\'s {0}', [target, target.card]];
    }

    getCostMessage(context: AbilityContext, additionalProperties = {}): [string, any[]] {
        let properties = (this.getProperties(context,additionalProperties) as SelectCardProperties)
        let target = (Array.isArray(properties.target) ? properties.target[0] : properties.target);
        return ['discarding {1}\'s status token', [target, target.personalHonor]];
    }

    eventHandler(event): void {
        if(event.token.card.personalHonor === event.token) {
            event.token.card.makeOrdinary();
        }
    }
}
