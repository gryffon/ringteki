import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import Event = require('../Events/Event');
import { EventNames } from '../Constants';

export interface LoseHonorProperties extends PlayerActionProperties {
    amount?: number;
}

export class LoseHonorAction extends PlayerAction {
    defaultProperties: LoseHonorProperties = { amount: 1 };

    name = 'loseHonor';
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

    canAffect(player: Player, context: AbilityContext): boolean {
        let properties: LoseHonorProperties = this.getProperties(context);
        return properties.amount === 0 ? false : super.canAffect(player, context);
    }

    getEvent(player: Player, context: AbilityContext): Event {
        let properties: LoseHonorProperties = this.getProperties(context);
        return super.createEvent(EventNames.OnModifyHonor, { player: player, amount: properties.amount, context: context }, event => player.modifyHonor(-event.amount));
    }
}

