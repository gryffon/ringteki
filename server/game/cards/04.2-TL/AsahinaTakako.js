const DrawCard = require('../../drawcard.js');
const { Locations, Players, CardTypes } = require('../../Constants');

class AsahinaTakako extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: Locations.Provinces,
            match: card => card.isDynasty && card.facedown,
            effect: ability.effects.canBeSeenWhenFacedown()
        });

        this.action({
            title: 'Discard a card or switch with another card',
            target: {
                cardType: [CardTypes.Character, CardTypes.Holding],
                location: Locations.Provinces,
                controller: Players.Self,
                gameAction: ability.actions.chooseAction(context => ({
                    messages: { 'Discard': '{0} chooses to discard {1}' },
                    choices: {
                        'Discard': ability.actions.discardCard({ target: context.target }),
                        'Switch with another card': ability.actions.moveCard({
                            destination: context.target.location,
                            switch: true,
                            promptForSelect: {
                                activePromptTitle: 'Choose a card to switch with',
                                cardType: [CardTypes.Character, CardTypes.Holding],
                                location: Locations.Provinces,
                                controller: Players.Self,
                                message: '{0} switches {1} in {2} and {3} in {4}',
                                messageArgs: card => [
                                    context.player, context.target.facedown ? 'a facedown card' : context.target,
                                    context.target.location, card.facedown ? 'a facedown card' : card, card.location
                                ]
                            }
                        })
                    }
                }))
            },
            effect: 'switch or discard {1} in {2}',
            effectArgs: context => [context.target.facedown ? 'a facedown card' : context.target, context.target.location]
        });
    }
}

AsahinaTakako.id = 'asahina-takako';

module.exports = AsahinaTakako;
