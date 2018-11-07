const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes } = require('../../Constants');

class BustlingAcademy extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a card in a province and refill it faceup',
            condition: context => context.player.cardsInPlay.any(card => card.hasTrait('scholar')) && context.player.opponent,
            target: {
                location: Locations.Provinces,
                cardType: [CardTypes.Character,CardTypes.Holding],
                gameAction: [
                    ability.actions.discardCard(),
                    ability.actions.refillFaceup(context => ({
                        target: context.target.controller,
                        location: context.target.location
                    }))
                ]
            },
            effect: 'discard {0} and refill it faceup'
        });
    }
}

BustlingAcademy.id = 'bustling-academy';

module.exports = BustlingAcademy;
