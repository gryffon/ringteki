const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
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
<<<<<<< HEAD
                    cardCondition: card => card.hasTrait('imperial') && card.getType() === CardTypes.Character,
                    cards: context.player.dynastyDeck.first(4),
                    choices: ['Do not replace Miya Library'],
                    cardHandler: (card) => {
                        let choices = context.player.dynastyDeck.first(4);
                        if(typeof card !== 'undefined' && card.hasTrait('imperial') && card.getType() === CardTypes.Character) {
=======
                    cards: context.player.dynastyDeck.first(4),
                    cardHandler: (card) => {
                        let choices = context.player.dynastyDeck.first(4);
                        if(card.hasTrait('imperial') && card.getType() === CardTypes.Character) {
>>>>>>> 48564c0b31ca56fe3393cff025fe0d08d4e87416
                            context.player.moveCard(card, context.source.location);
                            card.facedown = false;
                            choices.splice(choices.indexOf(card), 1);
                            choices.push(context.source);
<<<<<<< HEAD
=======

>>>>>>> 48564c0b31ca56fe3393cff025fe0d08d4e87416
                        }
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
