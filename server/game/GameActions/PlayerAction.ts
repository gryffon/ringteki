import { GameAction, GameActionProperties } from './GameAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');

export interface PlayerActionProperties extends GameActionProperties {}

export class PlayerAction extends GameAction {
    targetType = ['player'];

    defaultTargets(context: AbilityContext): Player[] {
        return context.player ? [context.player.opponent] : [];
    }

    checkEventCondition(event: any, additionalProperties):boolean {
        return this.canAffect(event.player, event.context, additionalProperties);
    }

    getEventProperties(event, player, context, additionalProperties = {}) {
        super.getEventProperties(event, player, context, additionalProperties);
        event.player = player;
    }
}
