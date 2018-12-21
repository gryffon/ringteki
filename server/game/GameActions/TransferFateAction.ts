import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import Event = require('../Events/Event');
import MoveFateEvent = require('../Events/MoveFateEvent');

export interface TransferFateProperties extends PlayerActionProperties {
    amount?: number;
}

export class TransferFateAction extends PlayerAction {
    name = 'takeFate';
    defaultProperties: TransferFateProperties = { amount: 1 };

    constructor(propertyFactory: TransferFateProperties | ((context: AbilityContext) => TransferFateProperties)) {
        super(propertyFactory);
    }
    
    getCostMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as TransferFateProperties;
        return ['giving {1} fate to {2}', [properties.amount, context.player.opponent]];
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as TransferFateProperties;
        return ['take {1} fate from {0}', [properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as TransferFateProperties;
        return player.opponent && properties.amount > 0 && player.fate >= properties.amount && super.canAffect(player, context);
    }

    getEvent(player: Player, context: AbilityContext, additionalProperties = {}): Event {
        let properties = this.getProperties(context, additionalProperties) as TransferFateProperties;
        return new MoveFateEvent({ context, player }, properties.amount, player, player.opponent, this);
    }
}
