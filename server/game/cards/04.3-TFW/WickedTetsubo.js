const DrawCard = require('../../drawcard.js');
const { TargetModes, CardTypes } = require('../../Constants');

class WickedTetsubo extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentConditions({
            trait: 'berserker'
        });

        this.action({
            title: 'Set Military or Political skill to 0',
            condition: context => context.source.parent.isAttacking(),
            targets: {
                character: {
                    activePromptTitle: 'Choose a defending character',
                    cardType: CardTypes.Character,
                    cardCondition: card => card.isDefending()
                },
                effect: {
                    mode: TargetModes.Select,
                    dependsOn: 'character',
                    activePromptTitle: 'Choose a skill to set to 0',
                    choices: {
                        'Military': ability.actions.cardLastingEffect(context => ({
                            target: context.targets.character,
                            effect: ability.effects.setMilitarySkill(0)
                        })),
                        'Political': ability.actions.cardLastingEffect(context => ({
                            target: context.targets.character,
                            effect: ability.effects.setPoliticalSkill(0)
                        }))
                    }
                }
            },
            effect: 'set {1}\'s {2} skill to 0',
            effectArgs: context => [context.targets.character, context.selects.effect.choice.toLowerCase()]
        });
    }
}

WickedTetsubo.id = 'wicked-tetsubo';

module.exports = WickedTetsubo;
