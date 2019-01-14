const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes, Locations } = require('../../Constants');

class MiyakosUndertaking extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Make a character a copy',
            condition: context => context.game.isDuringConflict(),
            targets: {
                cardToCopy: {
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    location: Locations.DynastyDiscardPile,
                    cardCondition: card => !card.isUnique()
                },
                myCharacter: {
                    dependsOn: 'cardToCopy',
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => card.isParticipating(),
                    gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                        effect: AbilityDsl.effects.copyCharacter(context.targets.cardToCopy)
                    }))
                }
            },
            effect: 'make {1} into a copy of {2}',
            effectArgs: context => [context.targets.myCharacter, context.targets.cardToCopy]
        });
    }
}

MiyakosUndertaking.id = 'miyako-s-undertaking';

module.exports = MiyakosUndertaking;
