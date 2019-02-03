const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilitDsl = require('../../abilitydsl');

class MiyaLibrary extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Replace Miya Library for a faceup imperial character',
            condition: context => context.player.dynastyDeck.size() > 0,
            effect: 'Search the top five card for your dynasty deck for an imperial character', 
            handler: context => {
                // let choices = 
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
                    this.togashiMendicantPrompt(context, promptCards, orderedCards, 'Which card do you want to be the next card?');
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
