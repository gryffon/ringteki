import { GameAction, GameActionProperties } from './GameAction';
import AbilityContext = require('../AbilityContext');
import { Token } from '../Interfaces';

export interface TokenActionProperties extends GameActionProperties {}

export class TokenAction extends GameAction {
    targetType = ['token'];

    defaultTargets(context: AbilityContext): Token[] {
        return context.source.personalHonor ? [context.source.personalHonor] : [];
    }

    canAffect(target: Token, context: AbilityContext, additionalProperties = {}): boolean {
        return target.type === 'token';
    }

    checkEventCondition(event: any, additionalProperties = {}): boolean {
        return this.canAffect(event.token, event.context, additionalProperties);
    }

    addPropertiesToEvent(event, token: Token, context: AbilityContext, additionalProperties): void {
        super.addPropertiesToEvent(event, token, context, additionalProperties);
        event.token = token;
    }
}
