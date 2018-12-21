import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');

import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Players } from '../Constants';
import { GameAction } from './GameAction';

export interface CardMenuProperties extends CardActionProperties {
    activePromptTitle?: string;
    player?: Players;
    cards: BaseCard[];
    choices?: string[];
    handlers?: Function[];
    message?: string;
    messageArgs?: (card: BaseCard, action: GameAction) => any[];
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

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as CardMenuProperties;
        return properties.cards.some(c => 
            properties.gameAction.canAffect(card, context, { [properties.actionParameter]: c })
        );
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as CardMenuProperties;
        if(properties.choices) {
            return true;
        }
        return properties.cards.some(card =>
            properties.gameAction.hasLegalTarget(context, { [properties.actionParameter]: card })
        );
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties) as CardMenuProperties;
        if(properties.cards.length === 0 || properties.player === Players.Opponent && !context.player.opponent) {
            return;
        }
        let player = properties.player === Players.Opponent ? context.player.opponent : context.player;
        let defaultProperties = {
            context: context,
            cardHandler: (card: BaseCard): void => {
                properties.gameAction.addEventsToArray(events, context, { [properties.actionParameter]: card });
                if(properties.message) {
                    context.game.addMessage(properties.message, ...properties.messageArgs(card, properties.gameAction))
                }
            }
        };
        context.game.promptWithHandlerMenu(player, Object.assign(defaultProperties, properties));
    }
}
