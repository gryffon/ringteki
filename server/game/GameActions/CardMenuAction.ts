import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import Player = require('../player');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Players } from '../Constants';
import { GameAction } from './GameAction';

export interface CardMenuProperties extends CardActionProperties {
    activePromptTitle?: string;
    player?: Players;
    cards: DrawCard[];
    cardCondition?: (card: DrawCard, context: AbilityContext) => boolean;
    choices?: string[];
    handlers?: Function[];
    targets?: boolean;
    message?: string;
    messageArgs?: (card: DrawCard, player: Player, cards: DrawCard[]) => any[];
    subActionProperties?: (card: DrawCard) => any;
    gameAction: GameAction;
    gameActionHasLegalTarget?: (context: AbilityContext) => boolean;
}

export class CardMenuAction extends CardGameAction {
    effect = 'choose a target for {0}';
    defaultProperties: CardMenuProperties = {
        activePromptTitle: 'Select a card:',
        subActionProperties: card => ({ target: card }),
        targets: false,
        cards: [],
        cardCondition: () => true,
        gameAction: null
    };

    constructor(properties: CardMenuProperties | ((context: AbilityContext) => CardMenuProperties)) {
        super(properties);
    }

    getProperties(context: AbilityContext, additionalProperties = {}): CardMenuProperties {
        let properties = super.getProperties(context, additionalProperties) as CardMenuProperties;
        properties.gameAction.setDefaultTarget(() => properties.target);
        return properties;
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.cards.some(c => 
            properties.gameAction.canAffect(card, context, Object.assign({}, additionalProperties, properties.subActionProperties(c)))
        );
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        if(properties.handlers) {
            return true;
        }
        if(properties.gameActionHasLegalTarget) {
            return properties.gameActionHasLegalTarget(context);
        }
        return properties.cards.some(card =>
            properties.gameAction.hasLegalTarget(context, Object.assign({}, additionalProperties, properties.subActionProperties(card)))
        );
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        let cardCondition = (card, context) =>
            properties.gameAction.hasLegalTarget(context, Object.assign({}, additionalProperties, properties.subActionProperties(card)))
            && properties.cardCondition(card, context);
        if((properties.cards.length === 0 && properties.choices.length === 0) || properties.player === Players.Opponent && !context.player.opponent) {
            return;
        }
        let player = properties.player === Players.Opponent ? context.player.opponent : context.player;
        if(properties.targets && context.choosingPlayerOverride) {
            player = context.choosingPlayerOverride;
        }
        let defaultProperties = {
            context: context,
            cardHandler: (card: DrawCard): void => {
                properties.gameAction.addEventsToArray(events, context, Object.assign({}, additionalProperties, properties.subActionProperties(card)));
                if(properties.message) {
                    let cards = properties.cards.filter(card => cardCondition(card, context));
                    context.game.addMessage(properties.message, ...properties.messageArgs(card, player, cards))
                }
            }
        };
        context.game.promptWithHandlerMenu(player, Object.assign(defaultProperties, properties, { cardCondition }))
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.targets || properties.gameAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties);
    }
}
