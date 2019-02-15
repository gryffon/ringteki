const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, Phases, CardTypes } = require('../../Constants');

class PeasantsAdvice extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'look at a province and return its dynasty card to deck',
            phase: Phases.Conflict,
            cost: AbilityDsl.costs.dishonor(),
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                gameAction: AbilityDsl.actions.sequentialAction([
                    AbilityDsl.actions.lookAt(),
                    AbilityDsl.actions.cardMenu(context => ({
                        activePromptTitle: 'Choose a card to return to owner\'s deck',
                        cards: context.target.controller.getSourceList(context.target.location).filter(card => card.isDynasty && !card.facedown),
                        choices: ['Done'],
                        handlers: [() => this.game.addMessage('{0} chooses not to return a dynasty card to its owner\'s deck', context.player)],
                        message: '{0} chooses to shuffle {1} into its owner\'s deck',
                        messageArgs: card => [context.player, card],
                        gameAction: AbilityDsl.actions.moveCard({
                            destination: Locations.DynastyDeck,
                            shuffle: true
                        })
                    }))
                ])
            },
            effect: 'look at {1}\'s {2}',
            effectArgs: context => [context.target.controller, context.target.location]
        });
    }
}

PeasantsAdvice.id = 'peasant-s-advice'; // This is a guess at what the id might be - please check it!!!

module.exports = PeasantsAdvice;
