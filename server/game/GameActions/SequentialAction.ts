import { GameAction, GameActionProperties } from './GameAction';
import AbilityContext = require('../AbilityContext');
import GameObject = require('../GameObject');

export interface SequentialProperties extends GameActionProperties {
    gameActions: GameAction[];
}

export class SequentialAction extends GameAction {
    defaultProperties: SequentialProperties;

    constructor(gameActions: GameAction[]) {
        super({ gameActions: gameActions } as GameActionProperties);
    }

    getEffectMessage(context: AbilityContext): [string, any] {
        let properties = super.getProperties(context) as SequentialProperties;  
        return properties.gameActions[0].getEffectMessage(context);      
    }

    getProperties(context: AbilityContext, additionalProperties = {}): SequentialProperties {
        let properties = super.getProperties(context, additionalProperties) as SequentialProperties;
        for(const gameAction of properties.gameActions) {
            gameAction.setDefaultTarget(() => properties.target);
        }
        return properties;
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        let { gameActions } = this.getProperties(context, additionalProperties);
        return gameActions.some(gameAction => gameAction.hasLegalTarget(context));
    }

    canAffect(target: GameObject, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.some(gameAction => gameAction.canAffect(target, context));
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        for(const gameAction of properties.gameActions) {
            if(gameAction.hasLegalTarget(context, additionalProperties)) {
                let eventsForThisAction = [];
                context.game.queueSimpleStep(() => gameAction.addEventsToArray(eventsForThisAction, context));
                if(gameAction !== properties.gameActions[properties.gameActions.length - 1]) {
                    context.game.queueSimpleStep(() => context.game.openEventWindow(eventsForThisAction));
                }
                context.game.queueSimpleStep(() => {
                    for(const event of eventsForThisAction) {
                        events.push(event);
                    }    
                });
            }
        }
    }

    hasTargetsChosenByInitiatingPlayer(context, additionalProperties = {}) {
        let properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.some(
            gameAction => gameAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties)
        );
    }
}
