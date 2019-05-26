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
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.lookAt(),
                    AbilityDsl.actions.selectCard(context => ({
                        activePromptTitle: 'Choose a faceup card to return to its owner\'s deck',
                        cardCondition: card =>
                            card.location === context.target.location &&
                            card.controller === context.target.controller &&
                            card.isDynasty && !card.facedown,
                        location: Locations.Provinces,
                        optional: true,
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

PeasantsAdvice.id = 'peasant-s-advice';

module.exports = PeasantsAdvice;
