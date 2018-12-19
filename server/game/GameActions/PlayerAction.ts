import { GameAction, GameActionProperties } from './GameAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');

export interface PlayerActionProperties extends GameActionProperties {}

export class PlayerAction extends GameAction {
    targetType = ['player'];

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player.opponent];
    }

    checkEventCondition(event: any):boolean {
        return this.canAffect(event.player, event.context);
    }
}
