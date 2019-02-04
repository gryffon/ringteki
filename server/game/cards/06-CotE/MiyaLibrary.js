const DrawCard = require('../../drawcard.js');
// const { CardTypes } = require('../../Constants');
// const AbilitDsl = require('../../abilitydsl');

class MiyaLibrary extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Replace Miya Library for a faceup imperial character',
            condition: context => context.player.dynastyDeck.size() > 0,
            effect: 'Search the top five card for your dynasty deck for an imperial character',
            handler: context => {
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'select an imperial character to replace miya library',
                    context: context,
                    cards: context.player.dynastyDeck.first(5),
                    cardHandler: (card) => {
                        let choices = context.player.dynastyDeck.first(5);
                        context.player.moveCard(card, context.source.location);
                        card.facedown = false;
                        choices.splice(choices.indexOf(card), 1);
                        choices.push(context.source);
                        this.miyaLibraryPrompt(context, choices, [], 'Select the card you would like to place on top of your dynasty deck');
                    }
                });
            }
        });
    }

    miyaLibraryPrompt(context, promptCards, orderedCards, promptTitle) {
        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: promptTitle,
            context: context,
            cards: promptCards,
            cardHandler: card => {
                orderedCards.push(card);
                promptCards = promptCards.filter(c => c !== card);
                if(promptCards.length > 1) {
                    this.miyaLibraryPrompt(context, promptCards, orderedCards, 'Which card would you like to put back now');
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
