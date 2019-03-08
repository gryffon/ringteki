const DrawCard = require('../../drawcard.js');
const { CardTypes, TargetModes } = require('../../Constants');

class Compass extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Look at top 3 cards of a deck',
            when: {
                onCardRevealed: (event, context) =>
                    event.card && event.card.type === CardTypes.Province && event.card.controller === context.player.opponent &&
                    context.source && context.source.parent && context.source.parent.isParticipating()
            },
            target: {
                mode: TargetModes.Select,
                activePromptTitle: 'Choose which deck to look at:',
                choices: {
                    'Dynasty Deck': context => context.player.dynastyDeck.size() > 0,
                    'Conflict Deck': context => context.player.conflictDeck.size() > 0
                }
            },
            effect: 'look at the top 3 cards of their {1}',
            effectArgs: context => [context.select.toLowerCase()],
            handler: context => {
                let cards = [];
                if(context.select === 'Dynasty Deck') {
                    cards = context.player.dynastyDeck.first(3);
                } else {
                    cards = context.player.conflictDeck.first(3);
                }
                let bottomOfDeck = cards[0].isDynasty ? 'dynasty deck bottom' : 'conflict deck bottom';
                let topOfDeck = cards[0].isDynasty ? 'dynasty deck' : 'conflict deck';
                this.moveToBottomHandler(context, cards, bottomOfDeck, topOfDeck);
            }
        });
    }

    moveToBottomHandler(context, cards, bottomOfDeck, topOfDeck) {
        if(cards.length > 0) {
            this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose a card to place on the bottom of your deck',
                context: context,
                cards: cards,
                choices: ['Done'],
                handlers: [() => this.moveToTopHandler(context, cards, topOfDeck)],
                cardHandler: card => {
                    this.game.addMessage('{0} places a card on the bottom of their {1}', context.player, context.select.toLowerCase());
                    context.player.moveCard(card, bottomOfDeck);
                    cards = cards.filter(c => c !== card);
                    this.moveToBottomHandler(context, cards, bottomOfDeck, topOfDeck);
                }
            });
        } else {
            this.moveToTopHandler(context, cards, topOfDeck);
        }
    }

    moveToTopHandler(context, cards, topOfDeck) {
        if(cards.length > 1) {
            this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose a card to place on the top of your deck',
                context: context,
                cards: cards,
                cardHandler: card => {
                    this.game.addMessage('{0} places a card on the top of their {1}', context.player, context.select.toLowerCase());
                    context.player.moveCard(card, topOfDeck);
                    cards = cards.filter(c => c !== card);
                    this.moveToTopHandler(context, cards, topOfDeck);
                }
            });
        } else if(cards.length === 1) {
            context.player.moveCard(cards[0], topOfDeck);
        }
    }
}

Compass.id = 'compass';

module.exports = Compass;
