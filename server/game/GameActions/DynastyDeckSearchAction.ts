import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import { Locations, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import Player = require('../player');

export interface DynastyDeckSearchProperties extends PlayerActionProperties {
    searchAmount?: number;
    selectAmount?: number; 
    reveal?: boolean;
    destination?: Locations;
    selectedCardsHandler?: (context, event, cards) => void;
    cardCondition?: (card: DrawCard, context: AbilityContext) => boolean;
}

export class DynastyDeckSearchAction extends PlayerAction {
    name = 'dynastyDeckSearch';
    eventName = EventNames.OnDeckSearch;

    defaultProperties: DynastyDeckSearchProperties = {
        searchAmount: -1,
        selectAmount: 1,
        destination: Locations.RemovedFromGame,
        selectedCardsHandler: null
    };

    getProperties(context: AbilityContext, additionalProperties = {}): DynastyDeckSearchProperties {
        let properties = super.getProperties(context, additionalProperties) as DynastyDeckSearchProperties;
        if(properties.reveal === undefined) {
            properties.reveal = properties.cardCondition !== undefined;            
        }
        properties.cardCondition = properties.cardCondition || (() => true);
        return properties;
    }
    
    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as DynastyDeckSearchProperties;
        let message = 'search their deck';
        if(properties.searchAmount > 0) {
            message = 'look at the top ' + (properties.searchAmount > 1 ? properties.searchAmount + ' cards' : 'card') + ' of their deck';
        }
        return [message, []];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as DynastyDeckSearchProperties;
        return properties.searchAmount !== 0 && player.dynastyDeck.size() > 0 && super.canAffect(player, context);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    addPropertiesToEvent(event, player: Player, context: AbilityContext, additionalProperties): void {
        let { searchAmount } = this.getProperties(context, additionalProperties) as DynastyDeckSearchProperties;        
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.searchAmount = searchAmount;
    }

    eventHandler(event, additionalProperties): void {
        let context = event.context;
        let player = event.player;
        let properties = this.getProperties(context, additionalProperties) as DynastyDeckSearchProperties;
        let searchAmount = event.searchAmount > -1 ? event.searchAmount : player.dynastyDeck.size();
        let cards = player.dynastyDeck.first(searchAmount);
        if(event.searchAmount === -1) {
            cards = cards.filter(card => properties.cardCondition(card, context));
        }

        let selectedCards = [];
        this.selectCard(event, additionalProperties, cards, selectedCards);
    }

    selectCard(event, additionalProperties, cards, selectedCards) {
        let context = event.context;
        let player = event.player;
        let properties = this.getProperties(context, additionalProperties) as DynastyDeckSearchProperties;

        context.game.promptWithHandlerMenu(player, {
            activePromptTitle: 'Select a card' + (properties.reveal ? ' to reveal' : ''),
            context: context,
            cards: cards,
            cardCondition: properties.cardCondition,
            choices: selectedCards.length > 0 ? ['Done'] : ['Take nothing'],
            handlers: [() => {
                this.handleDone(properties, context, event, selectedCards);
            }],
            cardHandler: card => {
                selectedCards = selectedCards.concat(card);
                let index = cards.indexOf(card, 0);
                if (index > -1)
                    cards.splice(index, 1);
                if ((properties.selectAmount < 0 || selectedCards.length < properties.selectAmount) && cards.length > 0) {
                    this.selectCard(event, additionalProperties, cards, selectedCards);
                }
                else {
                    this.handleDone(properties, context, event, selectedCards);
                }
            }
        });
    }

    handleDone(properties, context, event, selectedCards) {
        if (properties.selectedCardsHandler == null) {
            if (selectedCards.length > 0) {
                context.game.addMessage('{0} selects {1}', event.player, selectedCards.map(e => e.name).join(', '))
                selectedCards.forEach(card  => {
                    event.player.moveCard(card, properties.destination);
                });            
            }
            else
                context.game.addMessage('{0} takes nothing', event.player);
        }
        else {
            properties.selectedCardsHandler(context, event, selectedCards);
        }
    }
}
