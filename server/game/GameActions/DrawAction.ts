import { PlayerAction, PlayerActionProperties} from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import Event = require('../Events/Event');
import { EventNames } from '../Constants';

export interface DrawProperties extends PlayerActionProperties {
    amount?: number;
}

export class DrawAction extends PlayerAction {
    name = 'draw';
    eventName = EventNames.OnCardsDrawn;

    defaultProperties: DrawProperties = {
        amount: 1
    };
    constructor(properties: DrawProperties | ((context: AbilityContext) => DrawProperties)) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as DrawProperties;
        return ['draw ' + properties.amount + ' cards', []];
    }
    
    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as DrawProperties;
        return properties.amount !== 0 && super.canAffect(player, context);
    }

    defaultTargets(context: AbilityContext) {
        return [context.player];
    }

    getEventProperties(event, player, context, additionalProperties) {
        let { amount } = this.getProperties(context, additionalProperties) as DrawProperties;        
        super.getEventProperties(event, player, context, additionalProperties);
        event.amount = amount;
    }

    eventHandler(event) {
        event.player.drawCardsToHand(event.amount);
    }
}
