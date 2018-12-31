import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import Event = require('../Events/Event');
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

    getEventProperties(event, player, context, additionalProperties) {
        let { amount } = this.getProperties(context, additionalProperties) as GainFateProperties;        
        super.getEventProperties(event, player, context, additionalProperties);
        event.amount = amount;
    }

    eventHandler(event) {
        event.player.modifyFate(event.amount);
    }
}
