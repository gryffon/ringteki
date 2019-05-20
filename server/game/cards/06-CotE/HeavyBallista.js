const DrawCard = require('../../drawcard.js');
const { TargetModes, CardTypes, Locations, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class HeavyBallista extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow or remove 1 fate',
            condition: context => this.game.isDuringConflict('military') && context.player.isDefendingPlayer(),
            cost: AbilityDsl.costs.discardCard({ location: Locations.Hand }),
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    cardCondition: card => card.isAttacking() && !card.bowed
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'character',
                    player: context => context.targets.character.controller === context.player ? Players.Self : Players.Opponent,
                    choices: {
                        'Bow': AbilityDsl.actions.bow(context => ({ target: context.targets.character })),
                        'Remove 1 Fate': AbilityDsl.actions.removeFate(context => ({ target: context.targets.character }))
                    }
                }
            }
        });
    }
}

HeavyBallista.id = 'heavy-ballista';

module.exports = HeavyBallista;
