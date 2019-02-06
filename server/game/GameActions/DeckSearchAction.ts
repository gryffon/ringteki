import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import { Locations, EventNames, Decks } from '../Constants';
import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import Player = require('../player');
import { GameActionProperties } from './GameAction';

export interface DeckSearchProperties extends PlayerActionProperties {
    amount?: number;
    reveal?: boolean;
    cardCondition?: (card: DrawCard, context: AbilityContext) => boolean;
    cardHandler?: (card: DrawCard, context: AbilityContext) => void;
    activePromptTitle?: string;
    takeNothingHandler?: (context: AbilityContext) => void;
    deck?: Decks;
}

export class DeckSearchAction extends PlayerAction {
    name = 'deckSearch';
    eventName = EventNames.OnDeckSearch;

    defaultProperties: DeckSearchProperties = {
        amount: -1,
        reveal: false,
        cardCondition: () => true,
        deck: Decks.ConflictDeck
    };

    getProperties(context: AbilityContext, additionalProperties = {}): GameActionProperties {
        let properties = super.getProperties(context, additionalProperties) as DeckSearchProperties;
        properties.reveal = properties.reveal || properties.cardCondition.toString() !== this.defaultProperties.cardCondition.toString();
        return properties;
    }
    
    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as DeckSearchProperties;
        let message = 'search their deck';
        if(properties.amount > 0) {
            message = 'look at the top ' + (properties.amount > 1 ? properties.amount + ' cards' : 'card') + ' of their deck';
        }
        return [message, []];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as DeckSearchProperties;
        return properties.amount !== 0 && player.conflictDeck.size() > 0 && super.canAffect(player, context);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    addPropertiesToEvent(event, player: Player, context: AbilityContext, additionalProperties): void {
        let { amount } = this.getProperties(context, additionalProperties) as DeckSearchProperties;        
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
    }

    eventHandler(event, additionalProperties): void {
        let context = event.context;
        let player = event.player;
        let properties = this.getProperties(context, additionalProperties) as DeckSearchProperties;
        let deck = properties.deck === Decks.ConflictDeck ? player.conflictDeck : player.dynastyDeck;
        let amount = event.amount > -1 ? event.amount : deck.size();
        let cards = deck.first(amount);
        if(event.amount === -1) {
            cards = cards.filter(card => properties.cardCondition(card, context));
        }
        context.game.promptWithHandlerMenu(player, {
            activePromptTitle: properties.activePromptTitle || 'Select a card to ' + (properties.reveal ? 'reveal and ' : '') + 'put in your hand',
            context: context,
            cards: cards,
            cardCondition: properties.cardCondition,
            choices: ['Take nothing'],
            handlers: [properties.takeNothingHandler || (context => {
                context.game.addMessage('{0} takes nothing', context.player);
                context.player.shuffleDeck(properties.deck);
            })],
            cardHandler: properties.cardHandler || (card => {
                if(properties.reveal) {
                    context.game.addMessage('{0} takes {1} and adds it to their hand', player, card);
                } else {
                    context.game.addMessage('{0} takes a card into their hand', player);
                }
                player.moveCard(card, Locations.Hand);
                context.player.shuffleDeck(properties.deck);
            })
        });
    }
}
