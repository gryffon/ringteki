import { GameAction, GameActionProperties } from './GameAction';
import AbilityContext = require('../AbilityContext');
import GameObject = require('../GameObject');

export interface IfAbleActionProperties extends GameActionProperties {
    ifAbleAction: GameAction;
    otherwiseAction: GameAction;
}

export class IfAbleAction extends GameAction {
    defaultProperties: IfAbleActionProperties;

    getProperties(context: AbilityContext, additionalProperties = {}): IfAbleActionProperties {
        let properties = super.getProperties(context, additionalProperties) as IfAbleActionProperties;
        properties.ifAbleAction.setDefaultTarget(() => properties.target);
        properties.otherwiseAction.setDefaultTarget(() => properties.target);
        return properties;
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let { ifAbleAction, otherwiseAction } = this.getProperties(context);
        return ifAbleAction.hasLegalTarget(context) ? ifAbleAction.getEffectMessage(context) : otherwiseAction.getEffectMessage(context);
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}) {
        let { ifAbleAction, otherwiseAction } = this.getProperties(context, additionalProperties);
        return ifAbleAction.hasLegalTarget(context, additionalProperties) || otherwiseAction.hasLegalTarget(context, additionalProperties);
    }

    canAffect(target: GameObject, context: AbilityContext, additionalProperties = {}) {
        let { ifAbleAction, otherwiseAction } = this.getProperties(context, additionalProperties);
        return ifAbleAction.canAffect(target, context, additionalProperties) || otherwiseAction.canAffect(target, context, additionalProperties);
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}) {
        let { ifAbleAction, otherwiseAction } = this.getProperties(context, additionalProperties);
        let gameAction = ifAbleAction.hasLegalTarget(context) ? ifAbleAction : otherwiseAction;
        gameAction.addEventsToArray(events, context, additionalProperties);
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext, additionalProperties = {}) {
        let { ifAbleAction, otherwiseAction } = this.getProperties(context, additionalProperties);
        return ifAbleAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties) || 
            otherwiseAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties);        
    }
}