import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import Event = require('../Events/Event');
import { EventNames } from '../Constants';

export interface LoseFateProperties extends PlayerActionProperties {
    amount?: number;
}

export class LoseFateAction extends PlayerAction {
    name = 'spendFate';
    eventName = EventNames.OnModifyFate;
    defaultProperties: LoseFateProperties = { amount: 1 };

    constructor(propertyFactory: LoseFateProperties | ((context: AbilityContext) => LoseFateProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: LoseFateProperties = this.getProperties(context);
        return ['make {0} lose {1} fate', [properties.target, properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties: LoseFateProperties = this.getProperties(context, additionalProperties);
        return properties.amount > 0 && player.fate > 0 && super.canAffect(player, context);
    }

    getEventProperties(event, player, context, additionalProperties) {
        let { amount } = this.getProperties(context, additionalProperties) as LoseFateProperties;        
        super.getEventProperties(event, player, context, additionalProperties);
        event.amount = -amount;
    }

    eventHandler(event) {
        event.player.modifyFate(event.amount);
    }
}
