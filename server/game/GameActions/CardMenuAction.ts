import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');

import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Players } from '../Constants';
import { GameAction } from './GameAction';

export interface CardMenuProperties extends CardActionProperties {
    activePromptTitle?: string;
    player?: Players;
    cards: BaseCard[];
    message?: string;
    messageArgs?: (context: AbilityContext, action: GameAction) => any[];
    actionParameter?: string;
    gameAction: GameAction;
}

export class CardMenuAction extends CardGameAction {
    effect = 'choose a target for {0}';
    defaultProperties: CardMenuProperties = {
        activePromptTitle: 'Select a card:',
        actionParameter: 'target',
        cards: [],
        gameAction: null
    };

    constructor(properties: CardMenuProperties | ((context: AbilityContext) => CardMenuProperties)) {
        super(properties);
    }

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        let properties = this.getProperties(context) as CardMenuProperties;
        return properties.cards.some(c => {
            properties.gameAction.properties[properties.actionParameter] = c;
            return properties.gameAction.canAffect(card, context);
        });
    }

    hasLegalTarget(context: AbilityContext): boolean {
        let properties = this.getProperties(context) as CardMenuProperties;
        return properties.cards.some(card => {
            properties.gameAction.properties[properties.actionParameter] = card;
            return properties.gameAction.hasLegalTarget(context);
        });
    }

    addEventsToArray(events: any[], context: AbilityContext): void {
        let properties = this.getProperties(context) as CardMenuProperties;
        if(properties.cards.length === 0 || properties.player === Players.Opponent && !context.player.opponent) {
            return;
        }
        let player = properties.player === Players.Opponent ? context.player.opponent : context.player;
        let defaultProperties = {
            context: context,
            cardHandler: (card: BaseCard): void => {
                properties.gameAction.properties[properties.actionParameter] = card;
                properties.gameAction.addEventsToArray(events, context);
                if(properties.message) {
                    context.game.addMessage(properties.message, ...properties.messageArgs(context, properties.gameAction))
                }
            }
        };
        context.game.promptWithHandlerMenu(player, Object.assign(defaultProperties, properties));
    }
}
