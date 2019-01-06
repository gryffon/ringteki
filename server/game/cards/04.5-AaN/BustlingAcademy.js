const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, CardTypes } = require('../../Constants');

class BustlingAcademy extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard a card in a province and refill it faceup',
            condition: context => context.player.cardsInPlay.any(card => card.hasTrait('scholar')) && context.player.opponent,
            target: {
                location: Locations.Provinces,
                cardType: [CardTypes.Character, CardTypes.Holding],
                gameAction: AbilityDsl.actions.moveCard({ destination: Locations.DynastyDiscardPile })
            },
            effect: 'discard {0} and refill it faceup',
            then: context => ({
                gameAction: AbilityDsl.actions.refillFaceup(() => ({
                    target: context.events[0].cardStateWhenMoved.controller,
                    location: context.events[0].cardStateWhenMoved.location
                }))
            })
        });
    }
}

BustlingAcademy.id = 'bustling-academy';

module.exports = BustlingAcademy;
