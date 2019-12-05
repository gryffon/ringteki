import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import { Locations, EventNames, TargetModes, Decks } from '../Constants';
import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import Player = require('../player');

export interface DeckSearchProperties extends PlayerActionProperties {
    targetMode?: TargetModes;
    activePromptTitle?: string;
    amount?: number;
    numCards?: number;
    reveal?: boolean;
    destination?: Locations;
    deck?: Decks;
    shuffle?: Boolean;
    title?: String;
    selectedCardsHandler?: (context, event, cards) => void;
    cardCondition?: (card: DrawCard, context: AbilityContext) => boolean;
}

export class DeckSearchAction extends PlayerAction {
    name = 'deckSearch';
    eventName = EventNames.OnDeckSearch;

    defaultProperties: DeckSearchProperties = {
        amount: -1,
        numCards: 1,
        targetMode: TargetModes.Single,
        destination: Locations.Hand,
        deck: Decks.ConflictDeck,
        selectedCardsHandler: null,
        shuffle: true,
        reveal: true
    };

    getProperties(context: AbilityContext, additionalProperties = {}): DeckSearchProperties {
        let properties = super.getProperties(context, additionalProperties) as DeckSearchProperties;
        if(properties.reveal === undefined) {
            properties.reveal = properties.cardCondition !== undefined;            
        }
        properties.cardCondition = properties.cardCondition || (() => true);
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
        return properties.amount !== 0 && this.getDeck(player, properties).size() > 0 && super.canAffect(player, context);
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
        let amount = event.amount > -1 ? event.amount : this.getDeck(player, properties).size();
        let cards = this.getDeck(player, properties).first(amount);
        if(event.amount === -1) {
            cards = cards.filter(card => properties.cardCondition(card, context));
        }

        let selectedCards = [];
        this.selectCard(event, additionalProperties, cards, selectedCards);
    }

    selectCard(event, additionalProperties, cards, selectedCards) {
        let context = event.context;
        let player = event.player;
        let properties = this.getProperties(context, additionalProperties) as DeckSearchProperties;
        let canCancel = properties.targetMode !== TargetModes.Exactly;
        let selectAmount = 1;

        if (properties.targetMode === TargetModes.UpTo)
            selectAmount = properties.numCards;
        if (properties.targetMode === TargetModes.Single)
            selectAmount = 1;
        if (properties.targetMode === TargetModes.Exactly)
            selectAmount = properties.numCards;
        if (properties.targetMode === TargetModes.Unlimited)
            selectAmount = -1;
        
        let title = 'Select a card' + (properties.reveal ? ' to reveal' : '');
        if (properties.destination === Locations.Hand) {
            title = 'Select a card to ' + (properties.reveal ? 'reveal and ' : '') + 'put in your hand';
        }
        if (selectAmount < 0 || selectAmount > 1) {
            title = 'Select all cards' + (properties.reveal ? ' to reveal' : '');
            if (properties.destination === Locations.Hand) {
                title = 'Select all cards to ' + (properties.reveal ? 'reveal and ' : '') + 'put in your hand';
            }
        }

        context.game.promptWithHandlerMenu(player, {
            activePromptTitle: title,
            context: context,
            cards: cards,
            cardCondition: properties.cardCondition,
            choices: canCancel ? (selectedCards.length > 0 ? ['Done'] : ['Take nothing']) : ([]),
            handlers: [() => {
                this.handleDone(properties, context, event, selectedCards);
            }],
            cardHandler: card => {
                selectedCards = selectedCards.concat(card);
                let index = cards.indexOf(card, 0);
                if (index > -1)
                    cards.splice(index, 1);
                if ((selectAmount < 0 || selectedCards.length < selectAmount) && cards.length > 0) {
                    this.selectCard(event, additionalProperties, cards, selectedCards);
                }
                else {
                    this.handleDone(properties, context, event, selectedCards);
                }
            }
        });
    }

    handleDone(properties : DeckSearchProperties, context, event, selectedCards) {
        if (properties.selectedCardsHandler == null) {
            this.defaultHandleDone(properties, context, event, selectedCards);
        }
        else {
            properties.selectedCardsHandler(context, event, selectedCards);
        }

        if (properties.shuffle) {
            if (properties.deck === Decks.ConflictDeck) {
                event.player.shuffleConflictDeck();
            } else if (properties.deck === Decks.DynastyDeck) {
                event.player.shuffleDynastyDeck();
            }
        }
    }

    getDeck(player : Player, properties : DeckSearchProperties) {
        if (properties.deck === Decks.DynastyDeck) {
            return player.dynastyDeck;
        }

        return player.conflictDeck;
    }

    defaultHandleDone(properties : DeckSearchProperties, context, event, selectedCards) {
        if (selectedCards.length > 0) {
            if (properties.reveal) {
                switch(properties.destination) {
                    case Locations.Hand:
                        context.game.addMessage('{0} takes {1} and adds {2} to their hand', event.player, selectedCards.map(e => e.name).join(', '), selectedCards.length > 1 ? 'them' : 'it');
                        break;
                    default:
                        context.game.addMessage('{0} selects {1} and moves {2} to {3}', event.player, selectedCards.map(e => e.name).join(', '), selectedCards.length > 1 ? 'them' : 'it', properties.destination);
                        break;
                }
            }
            else {
                switch(properties.destination) {
                    case Locations.Hand:
                        context.game.addMessage('{0} takes {1} into their hand', event.player, selectedCards.length > 1 ? 'cards' : 'a card');
                        break;
                    default:
                        context.game.addMessage('{0} makes a selection and moves {2} to {3}', event.player, selectedCards.map(e => e.name).join(', '), selectedCards.length > 1 ? 'them' : 'it', properties.destination);
                        break;
                }
            }

            selectedCards.forEach(card  => {
                event.player.moveCard(card, properties.destination);
            });            
        }
        else
            context.game.addMessage('{0} takes nothing', event.player);
    }
}
