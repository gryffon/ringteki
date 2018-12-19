import AbilityContext = require('../AbilityContext');

import { GameAction, GameActionProperties } from './GameAction';
import { Players } from '../Constants';

interface MenuPromptProperties extends GameActionProperties {
    activePromptTitle: string;
    player?: Players;
    gameAction: GameAction;
    choices: string[];
    choiceHandler: (choice: string, displayMessage: boolean, action: GameAction) => void;
}

class MenuPromptAction extends GameAction {
    constructor(properties: MenuPromptProperties | ((context: AbilityContext) => MenuPromptProperties)) {
        super(properties);
    }

    getEffectMessage(): [string, any[]] {
        return ['make a choice for {0}',[]];
    }

    canAffect(target, context) {
        let properties = this.getProperties(context) as MenuPromptProperties;
        return properties.choices.some(choice => {
            properties.choiceHandler(choice, false, properties.gameAction);
            return properties.gameAction.canAffect(target, context);
        });
    }

    hasLegalTarget(context: AbilityContext): boolean {
        let properties = this.getProperties(context) as MenuPromptProperties;
        return properties.choices.some(choice => {
            properties.choiceHandler(choice, false, properties.gameAction);
            return properties.gameAction.hasLegalTarget(context);
        });
    }

    addEventsToArray(events, context) {
        let properties = this.getProperties(context) as MenuPromptProperties;
        if(properties.choices.length === 0 || properties.player === Players.Opponent && !context.player.oppoennt) {
            return;
        }
        let player = properties.player === Players.Opponent ? context.player.opponent : context.player;
        let choiceHandler = choice => {
            properties.choiceHandler(choice, true, properties.gameAction);
            properties.gameAction.addEventsToArray(events, context);
        }
        context.game.promptWithHandlerMenu(player, Object.assign(properties, { context, choiceHandler }));
    }
}

export = MenuPromptAction;
