const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Players, TargetModes } = require('../../Constants');

class AcolyteOfKoyane extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Gain or lose pride',
            condition: context => context.game.isDuringConflict('political'),
            targets: {
                character: {
                    controller: Players.Any,
                    cardType: CardTypes.Character,
                    cardCondition: card => card.isParticipating()
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'character',
                    choices: {
                        'Gain Pride': AbilityDsl.actions.cardLastingEffect(context => ({
                            effect: AbilityDsl.effects.addKeyword('pride'),
                            target: context.targets.character
                        })),
                        'Lose Pride': AbilityDsl.actions.cardLastingEffect(context => ({
                            effect: AbilityDsl.effects.loseKeyword('pride'),
                            target: context.targets.character
                        }))
                    }
                }
            },
            effect: '{1} until the end of the conflict',
            effectArgs: context => [[context.selects.select.choice === 'Gain Pride' ? 'give {0} Pride' : 'make {0} lose Pride', context.targets.character]]
        });
    }
}

AcolyteOfKoyane.id = 'acolyte-of-koyane';

module.exports = AcolyteOfKoyane;

