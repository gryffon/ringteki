import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import { EventNames } from '../Constants';

export interface BothPlayersGainHonorProperties extends PlayerActionProperties {
    amount?: number;
}

export class BothPlayersGainHonorAction extends PlayerAction {
    defaultProperties: BothPlayersGainHonorProperties = { amount: 1 };

    name: string = 'gainHonor';
    eventName = EventNames.OnModifyHonor;
    constructor(propertyFactory: BothPlayersGainHonorProperties | ((context: AbilityContext) => BothPlayersGainHonorProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: BothPlayersGainHonorProperties = this.getProperties(context);
        return ['both players gain ' + properties.amount + ' honor', []];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties: BothPlayersGainHonorProperties = this.getProperties(context, additionalProperties);
        return properties.amount === 0 ? false : super.canAffect(player, context) && super.canAffect(player.opponent, context);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player, context.player.opponent];
    }

    addPropertiesToEvent(event, player: Player, context: AbilityContext, additionalProperties): void {
        let { amount } = this.getProperties(context, additionalProperties) as BothPlayersGainHonorProperties;        
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
    }

    eventHandler(event): void {
        event.player.modifyHonor(event.amount) && event.player.opponent.modifyHonor(event.amount);
    }
}
