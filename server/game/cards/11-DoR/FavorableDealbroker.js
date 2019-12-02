import { CardTypes } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class FavorableDealbroker extends DrawCard {
    setupCardAbilities() {
        this.chosenCard = null;
        this.reaction({
            title: 'Put a character into play',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            effect: 'search their dynasty deck for a character that costs 1 and put it into play',
            gameAction: AbilityDsl.actions.cardMenu(context => ({
                activePromptTitle: 'Choose a character that costs 1',
                cards: context.player.dynastyDeck.first(context.player.dynastyDeck.size()),
                cardCondition: card => card.type === CardTypes.Character && card.printedCost === 1,
                choices: ['Don\'t choose a character'],
                handlers: [
                    function() {
                        context.game.addMessage('{0} chooses not to put a character into play', context.player);
                        context.player.shuffleDynastyDeck();
                    }
                ],
                subActionProperties: card => ({ target: card }),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.putIntoPlay(),
                    AbilityDsl.actions.shuffleDeck(context => ({
                        deck: Locations.DynastyDeck,
                        target: context.player
                    }))
                ])
            }))
        });
    }
}

FavorableDealbroker.id = 'favorable-dealbroker';

module.exports = FavorableDealbroker;
