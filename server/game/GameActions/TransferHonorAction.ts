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
        return ['take {1} honor from {0}', [properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext): boolean {
        let properties = this.getProperties(context) as TransferHonorProperties;
        return player.opponent && properties.amount > 0 && super.canAffect(player, context);
    }

    getEvent(player: Player, context: AbilityContext): Event {
        let properties = this.getProperties(context) as TransferHonorProperties;
        let params = {
            context: context,
            player: player,
            amount: properties.amount,
            afterBid: properties.afterBid
        };
        return super.createEvent(EventNames.OnTransferHonor, params, event => {
            event.player.modifyHonor(-event.amount);
            event.player.opponent.modifyHonor(event.amount);
        });
    }
}
