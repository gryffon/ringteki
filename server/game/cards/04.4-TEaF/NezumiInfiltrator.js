const DrawCard = require('../../drawcard.js');

class NezumiInfiltrator extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: [
                ability.effects.immuneTo({
                    restricts: 'maho',
                    source: this
                }),
                ability.effects.immuneTo({
                    restricts: 'shadowlands',
                    source: this
                })]
        }),
        this.reaction({
            title: 'Change attacked province\'s strength',
            condition: () => this.game.isDuringConflict(),
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            max: ability.limit.perConflict(1),
            target: {
                gameAction: ability.actions.chooseAction(() => ({
                    choices: {
                        'Raise attacked province\'s strength by 1': ability.actions.cardLastingEffect(() => ({
                            target: this.game.currentConflict.conflictProvince,
                            targetLocation: 'province',
                            effect: ability.effects.modifyProvinceStrength(1),
                            message: 'raise {1}\'s strength by 1 until the end of the conflict',
                            messageArgs: this.game.currentConflict.conflictProvince
                        })),
                        'Lower attacked province\'s strength by 1': ability.actions.cardLastingEffect(() => ({
                            target: this.game.currentConflict.conflictProvince,
                            targetLocation: 'province',
                            effect: ability.effects.modifyProvinceStrength(-1),
                            message: 'lower {1}\'s strength by 1 until the end of the conflict',
                            messageArgs: this.game.currentConflict.conflictProvince
                        }))
                    }
                }))
            }
        });
    }
}

NezumiInfiltrator.id = 'nezumi-infiltrator';

module.exports = NezumiInfiltrator;
