import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import Event = require('../Events/Event');
import { EventNames } from '../Constants';

export interface TransferHonorProperties extends PlayerActionProperties {
    amount?: number;
    afterBid?: boolean
}

export class TransferHonorAction extends PlayerAction {
    name = 'takeHonor';
    eventName = EventNames.OnTransferHonor;
    defaultProperties: TransferHonorProperties = { amount: 1, afterBid: false };

    constructor(propertyFactory: TransferHonorProperties | ((context: AbilityContext) => TransferHonorProperties)) {
        super(propertyFactory);
    }
    
    getCostMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as TransferHonorProperties;
        return ['giving {1} honor to {2}', [properties.amount, context.player.opponent]];
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as TransferHonorProperties;
        return ['take {1} honor from {0}', [properties.target, properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as TransferHonorProperties;
        return player.opponent && properties.amount > 0 && super.canAffect(player, context);
    }

    getEventProperties(event, player, context, additionalProperties) {
        let { afterBid, amount } = this.getProperties(context, additionalProperties) as TransferHonorProperties;        
        super.getEventProperties(event, player, context, additionalProperties);
        event.amount = amount;
        event.afterBid = afterBid;
    }

    eventHandler(event) {
        event.player.modifyHonor(-event.amount);
        event.player.opponent.modifyHonor(event.amount);
    }
}
