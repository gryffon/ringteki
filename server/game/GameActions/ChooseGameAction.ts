import { GameAction, GameActionProperties } from './GameAction';
import AbilityContext = require('../AbilityContext');
import { Players } from '../Constants';

export interface ChooseGameChoices {
    [choice: string]: GameAction;
}

export interface ChooseActionProperties extends GameActionProperties {
    activePromptTitle?: string;
    choices: ChooseGameChoices;
    messages: object;
    player?: Players;
}

export class ChooseGameAction extends GameAction {
    effect = 'choose between different actions';
    defaultProperties: ChooseActionProperties = {
        activePromptTitle: 'Select an action:',
        choices: {},
        messages: {}
    };
    constructor(properties: ChooseActionProperties | ((context: AbilityContext) => ChooseActionProperties)) {
        super(properties);
    }

    getProperties(context: AbilityContext, additionalProperties = {}): ChooseActionProperties {
        let properties = super.getProperties(context, additionalProperties) as ChooseActionProperties;
        for(const key of Object.keys(properties.choices)) {
            properties.choices[key].setDefaultTarget(() => properties.target);
        }
        return properties;
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return Object.values(properties.choices).some(
            gameAction => gameAction.hasLegalTarget(context)
        );
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        let activePromptTitle = properties.activePromptTitle;
        let choices = Object.keys(properties.choices);
        choices = choices.filter(key => properties.choices[key].hasLegalTarget(context));
        let player = properties.player === Players.Opponent ? context.player.opponent : context.player;
        let choiceHandler = (choice: string): void => {
            if(properties.messages[choice]) {
                context.game.addMessage(properties.messages[choice], player, properties.target);
            }
            context.game.queueSimpleStep(() => properties.choices[choice].addEventsToArray(events, context));
        }
        if(choices.length === 0) {
            return;
        }
        let target = properties.target;
        context.game.promptWithHandlerMenu(player, { activePromptTitle, context, choices, choiceHandler, target });
    }

    canAffect(target: any, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return Object.values(properties.choices).some(
            gameAction => gameAction.canAffect(target, context)
        );
    }

    hasTargetsChosenByInitiatingPlayer(context) {
        let properties = this.getProperties(context);
        return Object.values(properties.choices).some(
            gameAction => gameAction.hasTargetsChosenByInitiatingPlayer(context)
        );
    }
}
