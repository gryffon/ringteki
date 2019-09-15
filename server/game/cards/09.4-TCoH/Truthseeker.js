import { Locations, TargetModes } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class Truthseeker extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Look at top 3 cards',
            when: {
                onCharacterEntersPlay: (event, context) =>
                    event.card === context.source &&
                    [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour].includes(event.originalLocation)
            },
            target: {
                mode: TargetModes.Select,
                activePromptTitle: 'Choose which deck to look at:',
                choices: {
                    'Opponent\'s Dynasty Deck': context => context.player.opponent && context.player.opponent.dynastyDeck.size() > 0,
                    'Opponent\'s Conflict Deck': context => context.player.opponent && context.player.opponent.conflictDeck.size() > 0,
                    'Your Dynasty Deck': context => context.player && context.player.dynastyDeck.size() > 0,
                    'Your Conflict Deck': context => context.player && context.player.conflictDeck.size() > 0
                }
            },
            effect: 'look at the top 3 cards of {1}\'s {2}',
            effectArgs: context => this.mapChoiceToEffectArgs(context),
            handler: context => {
                let cardsToSort = this.mapChoiceToCards(context);
                this.truthSeekerPrompt(context, cardsToSort, [], 'Select the card you would like to place on top of the deck.');
            }
        });
    }

    mapChoiceToEffectArgs = context => {
        switch(context.select) {
            case 'Opponent\'s Dynasty Deck':
                return [context.player.opponent, 'dynasty deck'];
            case 'Opponent\'s Conflict Deck':
                return [context.player.opponent, 'conflict deck'];
            case 'Your Dynasty Deck':
                [context.player, 'dynasty deck'];
            case 'Your Conflict Deck':
                [context.player, 'conflict deck'];
        }
    }

    mapChoiceToCards = context => {
        switch(context.select) {
            case 'Opponent\'s Dynasty Deck':
                return context.player.opponent.dynastyDeck.first(3);
            case 'Opponent\'s Conflict Deck':
                return context.player.opponent.conflictDeck.first(3);
            case 'Your Dynasty Deck':
                return context.player.dynastyDeck.first(3);
            case 'Your Conflict Deck':
                return context.player.conflictDeck.first(3);
        }
    }

    truthSeekerPrompt(context, promptCards, orderedCards, promptTitle) {
        const orderPrompt = ['first', 'second'];
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
                context.player.dynastyDeck.splice(0, 3, ...orderedCards);
            }
        });
    }
}

Truthseeker.id = 'truthseeker';

module.exports = Truthseeker;

