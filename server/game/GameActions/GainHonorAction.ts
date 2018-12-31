import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import Event = require('../Events/Event');
import { EventNames } from '../Constants';

export interface GainHonorProperties extends PlayerActionProperties {
    amount?: number;
}

export class GainHonorAction extends PlayerAction {
    defaultProperties: GainHonorProperties = { amount: 1 };

    name: string = 'gainHonor';
    eventName = EventNames.OnModifyHonor;
    constructor(propertyFactory: GainHonorProperties | ((context: AbilityContext) => GainHonorProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: GainHonorProperties = this.getProperties(context);
        return ['gain ' + properties.amount + ' honor', []];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties: GainHonorProperties = this.getProperties(context, additionalProperties);
        return properties.amount === 0 ? false : super.canAffect(player, context);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    getEventProperties(event, player, context, additionalProperties) {
        let { amount } = this.getProperties(context, additionalProperties) as GainHonorProperties;        
        super.getEventProperties(event, player, context, additionalProperties);
        event.amount = amount;
    }

    eventHandler(event) {
        event.player.modifyHonor(event.amount);
    }
}
