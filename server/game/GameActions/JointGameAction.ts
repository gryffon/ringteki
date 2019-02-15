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

    getProperties(context: AbilityContext, additionalProperties = {}): JointGameProperties {
        let properties = super.getProperties(context, additionalProperties) as JointGameProperties;
        for(const gameAction of properties.gameActions) {
            gameAction.setDefaultTarget(() => properties.target);
        }
        return properties;
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.every(gameAction => gameAction.hasLegalTarget(context, additionalProperties));
    }

    canAffect(target: GameObject, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.every(gameAction => gameAction.canAffect(target, context, additionalProperties));
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        for(const gameAction of properties.gameActions) {
            gameAction.addEventsToArray(events, context, additionalProperties);
        }
    }

    hasTargetsChosenByInitiatingPlayer(context) {
        let properties = this.getProperties(context);
        return properties.gameActions.some(
            gameAction => gameAction.hasTargetsChosenByInitiatingPlayer(context)
        );
    }
}
