const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl.js');

class AncestralLands extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict('political'),
            effect: AbilityDsl.effects.modifyProvinceStrength(5)
        });
    }
}

AncestralLands.id = 'ancestral-lands';

module.exports = AncestralLands;
