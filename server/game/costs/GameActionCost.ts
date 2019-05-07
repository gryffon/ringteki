import { GameAction } from '../GameActions/GameAction';
import AbilityContext = require('../AbilityContext');


class GameActionCost {
    action: GameAction;

    constructor(action) {
        this.action = action;
    }

    getActionName(context: AbilityContext): string { // eslint-disable-line no-unused-vars
        return this.action.name;
    }

    canPay(context: AbilityContext): boolean {
        return this.action.hasLegalTarget(context);
    }

    addEventsToArray(events: any[], context: AbilityContext, result): void { // eslint-disable-line no-unused-vars
        context.costs[this.action.name] = this.action.getProperties(context).target;
        this.action.addEventsToArray(events, context);
    }

    getCostMessage(context: AbilityContext): [string, any[]] {
        return this.action.getCostMessage(context);
    }
}

export = GameActionCost;
