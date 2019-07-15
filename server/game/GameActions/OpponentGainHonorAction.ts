import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import { EventNames } from '../Constants';

export interface OpponentGainHonorProperties extends PlayerActionProperties {
    amount?: number;
}

export class OpponentGainHonorAction extends PlayerAction {
    defaultProperties: OpponentGainHonorProperties = { amount: 1 };

    name: string = 'gainHonor';
    eventName = EventNames.OnModifyHonor;
    constructor(propertyFactory: OpponentGainHonorProperties | ((context: AbilityContext) => OpponentGainHonorProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: OpponentGainHonorProperties = this.getProperties(context);
        return [context.player.opponent + ' gain ' + properties.amount + ' honor', []];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties: OpponentGainHonorProperties = this.getProperties(context, additionalProperties);
        return properties.amount === 0 ? false : super.canAffect(context.player.opponent, context);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player, context.player.opponent];
    }

    addPropertiesToEvent(event, player: Player, context: AbilityContext, additionalProperties): void {
        let { amount } = this.getProperties(context, additionalProperties) as OpponentGainHonorProperties;        
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
    }

    eventHandler(event): void {
        event.player.opponent.modifyHonor(event.amount);
    }
}
