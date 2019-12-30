const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class GoldenPlainsRaider extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Discard a card in a province',
            when: {
                afterConflict: (event, context) => context.source.isAttacking() &&
                                                    event.conflict.winner === context.player && context.player.opponent
            },
            target: {
                location: Locations.Provinces,
                controller: Players.Opponent,
                cardCondition: card => !card.facedown && card.type !== CardTypes.Province,
                gameAction: AbilityDsl.actions.discardCard()
            }
        });
    }
}

GoldenPlainsRaider.id = 'golden-plains-raider';

module.exports = GoldenPlainsRaider;
