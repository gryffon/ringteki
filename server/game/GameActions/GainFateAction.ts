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
    constructor(propertyFactory: GainFateProperties | ((context: AbilityContext) => GainFateProperties)) {
        super(propertyFactory);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: GainFateProperties = this.getProperties(context);
        return ['gain {1} fate', [properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext): boolean {
        let properties: GainFateProperties = this.getProperties(context);
        return properties.amount > 0 && super.canAffect(player, context);
    }

    getEvent(player: Player, context: AbilityContext): Event {
        let properties: GainFateProperties = this.getProperties(context);
        return super.createEvent(EventNames.OnModifyFate, { player: player, amount: properties.amount, context: context }, event => player.modifyFate(event.amount));
    }
}
