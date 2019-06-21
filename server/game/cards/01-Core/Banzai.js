const DrawCard = require('../../drawcard.js');
const { TargetModes, CardTypes } = require('../../Constants');
const CardAbility = require('../../CardAbility');
const AbilityDsl = require('../../abilitydsl');

class Banzai extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Increase a character\'s military skill',
            condition: () => this.game.isDuringConflict(),
            max: AbilityDsl.limit.perConflict(1),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.modifyMilitarySkill(2)
                }))
            },
            effect: 'grant 2 military skill to {0}',
            then: context => {
                if(context.subResolution) {
                    return {
                        target: {
                            mode: TargetModes.Select,
                            choices: {
                                'Lose 1 honor for no effect': AbilityDsl.actions.loseHonor({target: context.player }),
                                'Done': () => true
                            }
                        },
                        message: '{0} chooses {3}to lose an honor for no effect',
                        messageArgs: context => context.select === 'Done' ? 'not ' : ''
                    };
                }
                return {
                    target: {
                        mode: TargetModes.Select,
                        choices: {
                            'Lose 1 honor to resolve this ability again': AbilityDsl.actions.loseHonor({target: context.player }),
                            'Done': () => true
                        }
                    },
                    message: '{0} chooses {3}to lose an honor to resolve {1} again',
                    messageArgs: context => context.select === 'Done' ? 'not ' : '',
                    then: { gameAction: AbilityDsl.actions.resolveAbility({ ability: context.ability instanceof CardAbility ? context.ability : null, subResolution: true }) }
                };
            }
        });
    }
}

Banzai.id = 'banzai';

module.exports = Banzai;
