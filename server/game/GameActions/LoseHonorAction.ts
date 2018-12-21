import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import Event = require('../Events/Event');
import { EventNames } from '../Constants';
import { assertModuleDeclaration } from 'babel-types';

export interface LoseHonorProperties extends PlayerActionProperties {
    amount?: number;
    dueToUnopposed?: boolean
}

export class LoseHonorAction extends PlayerAction {
    defaultProperties: LoseHonorProperties = { amount: 1, dueToUnopposed: false };

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

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties: LoseHonorProperties = this.getProperties(context, additionalProperties);
        return properties.amount === 0 ? false : super.canAffect(player, context);
    }

    getEvent(player: Player, context: AbilityContext, additionalProperties = {}): Event {
        let { amount, dueToUnopposed } = this.getProperties(context, additionalProperties) as LoseHonorProperties;
        amount = -amount;
        return super.createEvent(EventNames.OnModifyHonor, { player, context, amount, dueToUnopposed }, event => player.modifyHonor(event.amount));
    }
}

