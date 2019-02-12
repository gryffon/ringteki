import { GameAction, GameActionProperties } from './GameAction';
import AbilityContext = require('../AbilityContext');

export interface ConditionalActionProperties extends GameActionProperties {
    gameAction: GameAction;
    condition: boolean | ((context: AbilityContext) => boolean);
    else?: GameAction;
}

export class ConditionalGameAction extends GameAction {
    effect = 'do a conditional action';

    constructor(properties: ConditionalActionProperties | ((context: AbilityContext) => ConditionalActionProperties)) {
        super(properties);
    }

    getProperties(context: AbilityContext, additionalProperties = {}): ConditionalActionProperties {
        let properties = super.getProperties(context, additionalProperties) as ConditionalActionProperties;
        properties.condition = properties.condition || true;
        return properties;
    }

    meetsCondition(context: AbilityContext, properties: ConditionalActionProperties): boolean {
        if(typeof properties.condition === 'function') {
            return properties.condition(context);
        }
        return properties.condition as boolean;
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        if(this.meetsCondition(context, properties)) {
            return properties.gameAction.hasLegalTarget(context, additionalProperties) || properties.else.hasLegalTarget(context, additionalProperties);
        }
        if(properties.else) {
            return properties.else.hasLegalTarget(context, additionalProperties);
        }
        return false;
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        if(this.meetsCondition(context, properties)) {
            if(properties.gameAction.hasLegalTarget(context, additionalProperties)) {
                properties.gameAction.addEventsToArray(events, context, additionalProperties);
            } else if(properties.else.hasLegalTarget(context, additionalProperties)) {
                properties.else.addEventsToArray(events, context, additionalProperties);
            }
        } else if(properties.else) {
            if(properties.else.hasLegalTarget(context, additionalProperties)) {
                properties.else.addEventsToArray(events, context, additionalProperties);
            }
        }
    }

    canAffect(target: any, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as ConditionalActionProperties;
        if(this.meetsCondition(context, properties)) {
            return properties.gameAction.canAffect(target, context, additionalProperties) || properties.else.canAffect(target, context, additionalProperties);
        }
        if(properties.else) {
            return properties.else.canAffect(target, context, additionalProperties);
        }
        return false;
    }
}
