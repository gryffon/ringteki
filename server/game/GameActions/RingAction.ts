import { GameAction, GameActionProperties } from './GameAction';
import AbilityContext = require('../AbilityContext');
import Ring = require('../player');

export interface RingActionProperties extends GameActionProperties {}

export class RingAction extends GameAction {
    targetType = ['ring'];

    defaultTargets(context: AbilityContext): Ring[] {
        return context.game.currentConflict ? [context.game.currentConflict.ring] : []
    }

    checkEventCondition(event: any, additionalProperties = {}):boolean {
        return this.canAffect(event.ring, event.context, additionalProperties);
    }

    getEventProperties(event, ring, context, additionalProperties) {
        super.getEventProperties(event, ring, context, additionalProperties);
        event.ring = ring;
    }
}
