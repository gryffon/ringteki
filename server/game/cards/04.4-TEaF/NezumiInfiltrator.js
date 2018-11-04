const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class NezumiInfiltrator extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [
                ability.effects.immunity({
                    restricts: 'maho'
                }),
                ability.effects.immunity({
                    restricts: 'shadowlands'
                })]
        }),
        this.reaction({
            title: 'Change attacked province\'s strength',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source && this.game.isDuringConflict()
            },
            max: ability.limit.perConflict(1),
            effect: 'change the province strength of {1}',
            effectArgs: context => context.game.currentConflict.conflictProvince,
            gameAction: ability.actions.chooseAction(() => ({
                target: this.game.currentConflict.conflictProvince,
                messages: {
                    'Raise attacked province\'s strength by 1': '{0} chooses to increase {1}\'s strength by 1',
                    'Lower attacked province\'s strength by 1': '{0} chooses to reduce {1}\'s strength by 1'
                },
                choices: {
                    'Raise attacked province\'s strength by 1': ability.actions.cardLastingEffect(() => ({
                        targetLocation: Locations.Provinces,
                        effect: ability.effects.modifyProvinceStrength(1)
                    })),
                    'Lower attacked province\'s strength by 1': ability.actions.cardLastingEffect(() => ({
                        targetLocation: Locations.Provinces,
                        effect: (
                            this.game.currentConflict.conflictProvince.getStrength() > 1 ?
                                ability.effects.modifyProvinceStrength(-1) : []
                        )
                    }))
                }
            }))
        });
    }
}

NezumiInfiltrator.id = 'nezumi-infiltrator';

module.exports = NezumiInfiltrator;
