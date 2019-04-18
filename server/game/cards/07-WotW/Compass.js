const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class Compass extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Look at top 3 cards of a deck',
            when: {
                onCardRevealed: (event, context) =>
                    event.card && event.card.type === CardTypes.Province && event.card.controller === context.player.opponent &&
                    context.source && context.source.parent && context.source.parent.isParticipating() &&
                    (context.player.dynastyDeck.size() > 0 || context.player.conflictDeck.size() > 0)
            },
            effect: 'look at the top 3 cards of one of their decks',
            handler: context => {
                let cards = [];
                let choices = [];
                let handlers = [];
                if(context.player.dynastyDeck.size() > 0) {
                    choices.push('Dynasty Deck');
                    handlers.push(() => {
                        this.game.addMessage('{0} chooses to look at the top 3 cards of their dynasty deck', context.player);
                        cards = context.player.dynastyDeck.first(3);
                        this.moveToBottomHandler(context, cards, 'dynasty deck');
                    });
                }
                if(context.player.conflictDeck.size() > 0) {
                    choices.push('Conflict Deck');
                    handlers.push(() => {
                        this.game.addMessage('{0} chooses to look at the top 3 cards of their conflict deck', context.player);
                        cards = context.player.conflictDeck.first(3);
                        this.moveToBottomHandler(context, cards, 'conflict deck');
                    });
                }

                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTite: 'Choose a deck',
                    choices: choices,
                    handlers: handlers
                });
            }
        });
    }

    moveToBottomHandler(context, cards, deck) {
        let bottomOfDeck = deck + ' bottom';
        if(cards.length > 0) {
            this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose a card to place on the bottom of your deck',
                context: context,
                cards: cards,
                choices: ['Done'],
                handlers: [() => this.moveToTopHandler(context, cards, deck)],
                cardHandler: card => {
                    this.game.addMessage('{0} places a card on the bottom of their {1}', context.player, deck);
                    context.player.moveCard(card, bottomOfDeck);
                    cards = cards.filter(c => c !== card);
                    this.moveToBottomHandler(context, cards, deck);
                }
            });
        } else {
            this.moveToTopHandler(context, cards, deck);
        }
    }

    moveToTopHandler(context, cards, deck) {
        if(cards.length > 1) {
            this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose a card to place on the top of your deck',
                context: context,
                cards: cards,
                cardHandler: card => {
                    this.game.addMessage('{0} places a card on the top of their {1}', context.player, deck);
                    context.player.moveCard(card, deck);
                    cards = cards.filter(c => c !== card);
                    this.moveToTopHandler(context, cards, deck);
                }
            });
        } else if(cards.length === 1) {
            context.player.moveCard(cards[0], deck);
        }
    }
}

Compass.id = 'compass';

module.exports = Compass;
