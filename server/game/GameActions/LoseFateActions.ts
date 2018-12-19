import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import Event = require('../Events/Event');
import { EventNames } from '../Constants';

export interface LoseFateProperties extends PlayerActionProperties {
    amount?: number;
}

export class LoseFateAction extends PlayerAction {
    name = 'spendFate';
    defaultProperties: LoseFateProperties = { amount: 1 };

    constructor(propertyFactory: LoseFateProperties | ((context: AbilityContext) => LoseFateProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: LoseFateProperties = this.getProperties(context);
        return ['make {0} lose {1} fate', [properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext): boolean {
        let properties: LoseFateProperties = this.getProperties(context);
        return properties.amount > 0 && player.fate > 0 && super.canAffect(player, context);
    }

    getEvent(player: Player, context: AbilityContext): Event {
        let properties: LoseFateProperties = this.getProperties(context);
        return super.createEvent(EventNames.OnModifyFate, { player: player, amount: properties.amount, context: context }, event => player.modifyFate(-event.amount));
    }
}
