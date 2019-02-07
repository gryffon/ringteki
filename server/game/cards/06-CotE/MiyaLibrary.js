
const DrawCard = require('../../drawcard.js');
const { CardTypes, Locations } = require('../../Constants');
// const AbilitDsl = require('../../abilitydsl');

class MiyaLibrary extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Replace Miya Library for a faceup imperial character',
            condition: context => context.player.dynastyDeck.size() > 0,
            effect: 'Search the top four card for your dynasty deck for an imperial character',
            handler: context => {
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'select an imperial character to replace miya library',
                    context: context,
                    cardCondition: card => card.hasTrait('imperial') && card.getType() === CardTypes.Character,
                    cards: context.player.dynastyDeck.first(4),
                    choices: ['Do not replace Miya Library'],
                    handlers: [() => this.miyaLibraryPrompt(context, context.player.dynastyDeck.first(4), [], 'Select the card you would like to place on top of your dynasty deck')],
                    cardHandler: (card) => {
                        if(card.hasTrait('imperial') && card.getType() === CardTypes.Character) {
                            context.player.moveCard(card, context.source.location);
                            card.facedown = false;
                            context.player.moveCard(context.source, Locations.DynastyDeck);
                        }
                        this.miyaLibraryPrompt(context, context.player.dynastyDeck.first(4), [], 'Select the card you would like to place on top of your dynasty deck');
                    }
                });
            }
        });
    }

    miyaLibraryPrompt(context, promptCards, orderedCards, promptTitle) {
        const orderPrompt = ['first', 'second', 'third'];
        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: promptTitle,
            context: context,
            cards: promptCards,
            cardHandler: card => {
                orderedCards.push(card);
                promptCards = promptCards.filter(c => c !== card);
                if(promptCards.length > 1) {
                    this.miyaLibraryPrompt(context, promptCards, orderedCards, 'Which card do you want to be the ' + orderPrompt[orderedCards.length] + ' card?');
                    return;
                } else if(promptCards.length === 1) {
                    orderedCards.push(promptCards[0]);
                }
                context.player.dynastyDeck.splice(0, 5, ...orderedCards);
            }
        });
    }
}

MiyaLibrary.id = 'miya-library';

module.exports = MiyaLibrary;
