import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import Event = require('../Events/Event');
import { EventNames } from '../Constants';

enum Direction {
    Decrease = 'decrease',
    Increase = 'increase',
    Prompt = 'prompt'
};

export interface ModifyBidProperties extends PlayerActionProperties {
    amount?: number;
    direction?: Direction;
}

export class ModifyBidAction extends PlayerAction {
    name = 'modifyBid';
    defaultProperties: ModifyBidProperties = { 
        amount: 1,
        direction: Direction.Increase
    };

    constructor(propertyFactory: ModifyBidProperties | ((context: AbilityContext) => ModifyBidProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: ModifyBidProperties = this.getProperties(context);
        if(properties.direction = Direction.Prompt) {
            return['modify their honor bid by {1}', [properties.amount]];
        }
        return ['{1} their bid by {2}', [properties.direction, properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext): boolean {
        let properties: ModifyBidProperties = this.getProperties(context);
        if(properties.amount === 0 || properties.direction === Direction.Decrease && player.honorBid === 0) {
            return false;
        }
        return super.canAffect(player, context);
    }

    addEventsToArray(events: any[], context: AbilityContext): void {
        let properties: ModifyBidProperties = this.getProperties(context);
        if(properties.direction !== Direction.Prompt) {
            return super.addEventsToArray(events, context);
        }
        for(const player of properties.target as Player[]) {
            if(player.honorBid === 0) {
                context.game.addMessage('{0} chooses to increase their honor bid', player);
                events.push(this.getModifyBidEvent(player, context, Direction.Increase));
            } else {
                context.game.promptWithHandlerMenu(player, {
                    context: context,
                    choices: ['Increase honor bid', 'Decrease honor bid'],
                    choiceHandler: choice => {
                        if(choice === 'Increase honor bid') {
                            context.game.addMessage('{0} chooses to increase their honor bid', player);
                            events.push(this.getModifyBidEvent(player, context, Direction.Increase));
                        } else {
                            context.game.addMessage('{0} chooses to decrease their honor bid', player);
                            events.push(this.getModifyBidEvent(player, context, Direction.Decrease));
                        }
                    }
                });        
            }
        }
    }

    getEvent(player: Player, context: AbilityContext): Event {
        let properties: ModifyBidProperties = this.getProperties(context);
        return this.getModifyBidEvent(player, context, properties);
    }

    getModifyBidEvent(player: Player, context: AbilityContext, properties) {
        return super.createEvent(EventNames.OnModifyBid, Object.assign({ context }, properties), event => {
            if(event.direction === Direction.Increase) {
                player.honorBidModifier += event.amount;
            } else {
                player.honorBidModifier -= event.amount;
            }
        });
    }
}
