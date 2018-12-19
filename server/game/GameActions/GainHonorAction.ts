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
    constructor(propertyFactory: GainHonorProperties | ((context: AbilityContext) => GainHonorProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: GainHonorProperties = this.getProperties(context);
        return ['gain ' + properties.amount + ' honor', []];
    }

    canAffect(player: Player, context: AbilityContext): boolean {
        let properties: GainHonorProperties = this.getProperties(context);
        return properties.amount === 0 ? false : super.canAffect(player, context);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    getEvent(player: Player, context: AbilityContext): Event {
        let properties: GainHonorProperties = this.getProperties(context);
        return super.createEvent(EventNames.OnModifyHonor, { player: player, amount: properties.amount, context: context }, event => player.modifyHonor(event.amount));
    }
}
