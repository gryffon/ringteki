import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import { Locations, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');

export interface DeckSearchProperties extends PlayerActionProperties {
    amount: number;
    reveal: boolean;
    cardCondition: (card: BaseCard, context: AbilityContext) => boolean;
}

export class DeckSearchAction extends PlayerAction {
    name = 'deckSearch';
    eventName = EventNames.OnDeckSearch;

    defaultProperties: DeckSearchProperties = {
        amount: -1,
        reveal: false,
        cardCondition: () => true
    };

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as DeckSearchProperties;
        let message = 'search their deck';
        if(properties.amount > 0) {
            message = 'look at the top ' + (properties.amount > 1 ? properties.amount + ' cards' : 'card') + ' of their deck';
        }
        return [message, []];
    }

    canAffect(player, context, additionalProperties = {}) {
        let properties = this.getProperties(context, additionalProperties) as DeckSearchProperties;
        return properties.amount !== 0 && player.conflictDeck.size() > 0 && super.canAffect(player, context);
    }

    defaultTargets(context) {
        return [context.player];
    }

    getEventProperties(event, player, context, additionalProperties) {
        let { amount } = this.getProperties(context, additionalProperties) as DeckSearchProperties;        
        super.getEventProperties(event, player, context, additionalProperties);
        event.amount = amount;
    }

    eventHandler(event, additionalProperties) {
        let context = event.context;
        let player = event.player;
        let properties = this.getProperties(context, additionalProperties) as DeckSearchProperties;
        let amount = event.amount > -1 ? event.amount : player.conflictDeck.size();
        context.game.promptWithHandlerMenu(player, {
            activePromptTitle: 'Select a card to ' + (properties.reveal ? 'reveal and ' : '') + 'put in your hand',
            context: context,
            cards: player.conflictDeck.first(amount).filter(card => properties.cardCondition(card, context)),
            choices: ['Take nothing'],
            handlers: [() => {
                context.game.addMessage('{0} takes nothing', player);
                player.shuffleConflictDeck();
            }],
            cardHandler: card => {
                if(properties.reveal) {
                    context.game.addMessage('{0} takes {1} and adds it to their hand', player, card);
                } else {
                    context.game.addMessage('{0} takes a card into their hand', player);
                }
                player.moveCard(card, Locations.Hand);
                player.shuffleConflictDeck();
            }
        });
    }
}
