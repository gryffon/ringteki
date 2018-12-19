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

    getProperties(context: AbilityContext): SequentialProperties {
        let properties = super.getProperties(context) as SequentialProperties;
        for(const gameAction of properties.gameActions) {
            gameAction.setDefaultTarget(() => properties.target);
        }
        return properties;
    }

    hasLegalTarget(context: AbilityContext): boolean {
        let properties = this.getProperties(context);
        return properties.gameActions.some(gameAction => gameAction.hasLegalTarget(context));
    }

    canAffect(target: GameObject, context: AbilityContext): boolean {
        let properties = this.getProperties(context);
        return properties.gameActions.some(gameAction => gameAction.canAffect(target, context));
    }

    addEventsToArray(events: any[], context: AbilityContext): void {
        let properties = this.getProperties(context);
        for(const gameAction of properties.gameActions) {
            context.game.queueSimpleStep(() => {
                let events = [];
                gameAction.addEventsToArray(events, context);
                context.game.openEventWindow(events);
            });
        }
    }
}
