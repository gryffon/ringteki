const DrawCard = require('../../drawcard.js');
const { CardTypes, Players, TargetModes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class AlluringPatron extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move or dishonor a character',
            condition: context => context.source.isParticipating(),
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: card => !card.isParticipating()
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'character',
                    player: Players.Opponent,
                    choices: {
                        'Move this character to the conflict': AbilityDsl.actions.moveToConflict(context => ({
                            target: context.targets.character
                        })),
                        'Dishonor this character': AbilityDsl.actions.dishonor(context => ({
                            target: context.targets.character
                        }))
                    }
                }
            }
        });
    }
}

AlluringPatron.id = 'alluring-patron';

module.exports = AlluringPatron;
