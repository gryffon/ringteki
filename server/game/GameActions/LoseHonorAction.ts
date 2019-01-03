import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import { EventNames } from '../Constants';

export interface LoseHonorProperties extends PlayerActionProperties {
    amount?: number;
    dueToUnopposed?: boolean
}

export class LoseHonorAction extends PlayerAction {
    defaultProperties: LoseHonorProperties = { amount: 1, dueToUnopposed: false };

    name = 'loseHonor';
    eventName = EventNames.OnModifyHonor;
    constructor(propertyFactory: LoseHonorProperties | ((context: AbilityContext) => LoseHonorProperties)) {
        super(propertyFactory);
    }

    getCostMessage(context: AbilityContext): [string, any[]] {
        let properties: LoseHonorProperties = this.getProperties(context);
        return ['losing {1} honor', [properties.amount]];
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: LoseHonorProperties = this.getProperties(context);
        return ['lose ' + properties.amount + ' honor', []];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties: LoseHonorProperties = this.getProperties(context, additionalProperties);
        return properties.amount === 0 ? false : super.canAffect(player, context);
    }

    addPropertiesToEvent(event, player: Player, context: AbilityContext, additionalProperties): void {
        let { amount, dueToUnopposed } = this.getProperties(context, additionalProperties) as LoseHonorProperties;        
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = -amount;
        event.dueToUnopposed = dueToUnopposed;
    }

    eventHandler(event): void {
        event.player.modifyHonor(event.amount);
    }
}

