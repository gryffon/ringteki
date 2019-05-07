import AbilityContext = require('../AbilityContext');

import { GameAction, GameActionProperties } from './GameAction';
import { Players } from '../Constants';

export interface MenuPromptProperties extends GameActionProperties {
    activePromptTitle: string;
    player?: Players;
    gameAction: GameAction;
    choices: string[] | ((properties: any) => string[]);
    choiceHandler: (choice: string, displayMessage: boolean, properties: MenuPromptProperties) => object;
}

export class MenuPromptAction extends GameAction {
    constructor(properties: MenuPromptProperties | ((context: AbilityContext) => MenuPromptProperties)) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let { target } = this.getProperties(context);
        return ['make a choice for {0}',[target]];
    }

    getProperties(context: AbilityContext, additionalProperties = {}): MenuPromptProperties {
        let properties = super.getProperties(context, additionalProperties) as MenuPromptProperties;
        if(typeof properties.choices === 'function') {
            properties.choices = properties.choices(properties);
        }
        return properties;
    }

    canAffect(target: any, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return (properties.choices as string[]).some(choice => {
            let childProperties = properties.choiceHandler(choice, false, properties);
            return properties.gameAction.canAffect(target, context, childProperties);
        });
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return (properties.choices as string[]).some(choice => {
            let childProperties = properties.choiceHandler(choice, false, properties);
            return properties.gameAction.hasLegalTarget(context, childProperties);
        });
    }

    addEventsToArray(events, context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        if(properties.choices.length === 0 || properties.player === Players.Opponent && !context.player.opponent) {
            return;
        }
        let player = properties.player === Players.Opponent ? context.player.opponent : context.player;
        let choiceHandler = choice => {
            let childProperties = properties.choiceHandler(choice, true, properties);
            properties.gameAction.addEventsToArray(events, context, childProperties);
        }
        if(properties.choices.length === 1) {
            choiceHandler(properties.choices[0]);
            return;
        }
        context.game.promptWithHandlerMenu(player, Object.assign({}, properties, { context, choiceHandler }));
    }

    hasTargetsChosenByInitiatingPlayer(context) {
        let properties = this.getProperties(context);
        return properties.gameAction.hasTargetsChosenByInitiatingPlayer(context);
    }
}
