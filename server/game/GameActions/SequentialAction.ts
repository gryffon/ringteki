import { GameAction, GameActionProperties } from './GameAction';
import AbilityContext = require('../AbilityContext');
import GameObject = require('../GameObject');

export interface SequentialProperties extends GameActionProperties {
    gameActions: GameAction[];
}

export class SequentialAction extends GameAction {
    effect = 'do several things';
    defaultProperties: SequentialProperties;

    constructor(gameActions: GameAction[]) {
        super({ gameActions: gameActions } as GameActionProperties);
    }

    getProperties(context: AbilityContext, additionalProperties = {}): SequentialProperties {
        let properties = super.getProperties(context, additionalProperties) as SequentialProperties;
        for(const gameAction of properties.gameActions) {
            gameAction.setDefaultTarget(() => properties.target);
        }
        return properties;
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.some(gameAction => gameAction.hasLegalTarget(context));
    }

    canAffect(target: GameObject, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.some(gameAction => gameAction.canAffect(target, context));
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        for(const gameAction of properties.gameActions) {
            context.game.queueSimpleStep(() => {
                let events = [];
                gameAction.addEventsToArray(events, context);
                context.game.openEventWindow(events);
            });
        }
    }
}
