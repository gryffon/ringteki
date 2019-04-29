import { GameAction, GameActionProperties } from './GameAction';
import AbilityContext = require('../AbilityContext');
import StatusToken = require('../StatusToken');

export interface TokenActionProperties extends GameActionProperties {}

export class TokenAction extends GameAction {
    targetType = ['token'];

    defaultTargets(context: AbilityContext): StatusToken[] {
        return context.source.personalHonor ? [context.source.personalHonor] : [];
    }

    canAffect(target: StatusToken, context: AbilityContext, additionalProperties = {}): boolean {
        return target.type === 'token';
    }

    checkEventCondition(event: any, additionalProperties = {}): boolean {
        return this.canAffect(event.token, event.context, additionalProperties);
    }

    addPropertiesToEvent(event, token: StatusToken, context: AbilityContext, additionalProperties): void {
        super.addPropertiesToEvent(event, token, context, additionalProperties);
        event.token = token;
    }
}
