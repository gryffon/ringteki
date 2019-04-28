import { GameAction, GameActionProperties } from './GameAction';
import AbilityContext = require('../AbilityContext');

export interface ConditionalActionProperties extends GameActionProperties {
    condition: ((context: AbilityContext) => boolean) | boolean;
    trueGameAction: GameAction;
    falseGameAction: GameAction;
}

export class ConditionalAction extends GameAction {
    defaultProperties: ConditionalActionProperties;

    getProperties(context: AbilityContext, additionalProperties = {}): ConditionalActionProperties {
        let properties = super.getProperties(context, additionalProperties) as ConditionalActionProperties;
        properties.trueGameAction.setDefaultTarget(() => properties.target);
        properties.falseGameAction.setDefaultTarget(() => properties.target);
        return properties;
    }

    getGameAction(context: AbilityContext, additionalProperties = {}): GameAction {
        let properties = this.getProperties(context, additionalProperties);
        let condition = properties.condition;
        if(typeof(condition) === 'function') {
            condition = condition(context);
        }
        return condition ? properties.trueGameAction : properties.falseGameAction;
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        return this.getGameAction(context).getEffectMessage(context);
    }

    canAffect(target: any, context: AbilityContext, additionalProperties = {}): boolean {
        return this.getGameAction(context, additionalProperties).canAffect(target, context, additionalProperties);
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        return this.getGameAction(context, additionalProperties).hasLegalTarget(context, additionalProperties);
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        this.getGameAction(context, additionalProperties).addEventsToArray(events, context, additionalProperties);
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext, additionalProperties = {}): boolean {
        return this.getGameAction(context, additionalProperties).hasTargetsChosenByInitiatingPlayer(context, additionalProperties);
    }
}
