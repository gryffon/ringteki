import { PlayerAction, PlayerActionProperties} from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import Event = require('../Events/Event');
import { EventNames } from '../Constants';

export interface DrawProperties extends PlayerActionProperties {
    amount: number;
}

export class DrawAction extends PlayerAction {
    name = 'draw';

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

    getEvent(player: Player, context: AbilityContext, additionalProperties = {}): Event {
        let properties = this.getProperties(context, additionalProperties) as DrawProperties;
        return super.createEvent(EventNames.OnCardsDrawn, {
            player: player,
            amount: properties.amount,
            context: context
        }, event => player.drawCardsToHand(event.amount));
    }
}
