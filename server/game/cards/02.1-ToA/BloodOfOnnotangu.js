const ProvinceCard = require('../../provincecard.js');
const { Players } = require('../../Constants');

class BloodOfOnnotangu extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: Players.Any,
            condition: context => context.source.isConflictProvince(),
            effect: ability.effects.playerCannot('spendFate')
        });
    }
}

BloodOfOnnotangu.id = 'blood-of-onnotangu';

module.exports = BloodOfOnnotangu;
