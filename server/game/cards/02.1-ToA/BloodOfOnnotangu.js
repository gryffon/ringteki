const ProvinceCard = require('../../provincecard.js');

class BloodOfOnnotangu extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: () => this.isConflictProvince(),
            effect: ability.effects.playerCannot('spendFate')
        });
    }
}

BloodOfOnnotangu.id = 'blood-of-onnotangu';

module.exports = BloodOfOnnotangu;
