const DrawCard = require('../../drawcard.js');
const { TargetModes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class HeroOfThreeTrees extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain 1 honor or reduce the attacked province strength',
            condition: context => context.source.isParticipating()
                && context.player.opponent
                && context.player.hand.size() < context.player.opponent.hand.size(),
            target: {
                mode: TargetModes.Select,
                choices: {
                    'Gain 1 honor': AbilityDsl.actions.gainHonor(),
                    'Lower attacked province\'s strength by 1': AbilityDsl.actions.cardLastingEffect(() => ({
                        target: this.game.currentConflict.conflictProvince,
                        effect: (
                            this.game.currentConflict.conflictProvince.getStrength() > 1 ?
                                ability.effects.modifyProvinceStrength(-1) : []
                        )
                    }))
                }
            },
            effect: '{1}{2}',
            effectArgs: context => [context.select === 'Gain 1 honor' ? 'gain 1 honor' : 'reduce the strength of ',
                context.select === 'Gain 1 honor' ? '' : this.game.currentConflict.conflictProvince.name + ' by 1']
        });
    }
}

HeroOfThreeTrees.id = 'hero-of-three-trees';

module.exports = HeroOfThreeTrees;
