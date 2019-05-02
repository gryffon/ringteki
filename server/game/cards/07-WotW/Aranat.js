const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Locations, Players, TargetModes } = require('../../Constants');

class Aranat extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Place additional fate',
            when: {
                onCardPlayed: (event, context) => context.player.opponent && event.card === context.source
            },
            effect: 'give {1} the opportunity to reveal provinces',
            effectArgs: context => context.player.opponent,
            gameAction: AbilityDsl.actions.selectCard({
                cardType: CardTypes.Province,
                location: [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour],
                controller: Players.Opponent,
                player: Players.Opponent,
                optional: true,
                mode: TargetModes.Unlimited,
                cardCondition: card => card.facedown,
                message: '{0} chooses to reveal {1}',
                messageArgs: (card, player) => [player, card],
                gameAction: AbilityDsl.actions.reveal()
            }),
            then: {
                message: '{3} has {4} facedown provinces so {4} fate is placed on {1}',
                messageArgs: context => [context.player.opponent, 5 - context.player.getNumberOfOpponentsFaceupProvinces()],
                thenCondition: () => true,
                gameAction: AbilityDsl.actions.placeFate(context => ({
                    target: context.source,
                    amount: 5 - context.player.getNumberOfOpponentsFaceupProvinces()
                }))
            }
        });
    }
}

Aranat.id = 'aranat';

module.exports = Aranat;
