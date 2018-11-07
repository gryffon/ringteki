const DrawCard = require('../../drawcard.js');
const { Locations, Phases } = require('../../Constants');

class PeasantsAdvice extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'look at a province and return its dynasty card to deck',
            phase: Phases.Conflict,
            cost: ability.costs.dishonor(() => true),
            target: {
                cardType: 'province',
                location: Locations.Provinces,
                gameAction: ability.actions.sequentialAction([
                    ability.actions.lookAt(),
                    ability.actions.returnToDeck(context => ({
                        location: context.target.location,
                        shuffle: true,
                        promptWithHandlerMenu: {
                            activePromptTitle: 'Choose a card to return to owner\'s deck',
                            cards: context.target.controller.getSourceList(context.target.location).filter(card => card.isDynasty && !card.facedown),
                            choices: ['Done'],
                            handlers: [() => this.game.addMessage('{0} chooses not to return a dynasty card to its owner\'s deck', context.player)],
                            message: '{0} chooses to shuffle {2} into its owner\'s deck'
                        }
                    }))
                ])
            }
        });
    }
}

PeasantsAdvice.id = 'peasant-s-advice'; // This is a guess at what the id might be - please check it!!!

module.exports = PeasantsAdvice;
