import { GameAction, GameActionProperties } from './GameAction';
import AbilityContext = require('../AbilityContext');
import GameObject = require('../GameObject');

export interface JointGameProperties extends GameActionProperties {
    gameActions: GameAction[];
}

export class JointGameAction extends GameAction {
    effect = 'do several things';
    defaultProperties: JointGameProperties;

    constructor(gameActions: GameAction[]) {
        super({ gameActions: gameActions } as GameActionProperties);
    }

    getProperties(context: AbilityContext): JointGameProperties {
        let properties = super.getProperties(context) as JointGameProperties;
        for(const gameAction of properties.gameActions) {
            gameAction.setDefaultTarget(() => properties.target);
        }
        return properties;
    }

    hasLegalTarget(context: AbilityContext): boolean {
        let properties = this.getProperties(context);
        return properties.gameActions.every(gameAction => gameAction.hasLegalTarget(context));
    }

    canAffect(target: GameObject, context: AbilityContext): boolean {
        let properties = this.getProperties(context);
        return properties.gameActions.every(gameAction => gameAction.canAffect(target, context));
    }

    addEventsToArray(events: any[], context: AbilityContext): void {
        let properties = this.getProperties(context);
        for(const gameAction of properties.gameActions) {
            gameAction.addEventsToArray(events, context);
        }
    }
}

module.exports = JointGameAction;
