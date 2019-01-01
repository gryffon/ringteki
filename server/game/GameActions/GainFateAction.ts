import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import { EventNames } from '../Constants';

export interface GainFateProperties extends PlayerActionProperties {
    amount?: number;
}

export class GainFateAction extends PlayerAction {
    defaultProperties: GainFateProperties = { amount: 1 };

    name = 'gainFate';
    eventName = EventNames.OnModifyFate;
    constructor(propertyFactory: GainFateProperties | ((context: AbilityContext) => GainFateProperties)) {
        super(propertyFactory);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: GainFateProperties = this.getProperties(context);
        return ['gain {0} fate', [properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties: GainFateProperties = this.getProperties(context, additionalProperties);
        return properties.amount > 0 && super.canAffect(player, context);
    }

    addPropertiesToEvent(event, player: Player, context: AbilityContext, additionalProperties): void {
        let { amount } = this.getProperties(context, additionalProperties) as GainFateProperties;        
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
    }

    eventHandler(event): void {
        event.player.modifyFate(event.amount);
    }
}
