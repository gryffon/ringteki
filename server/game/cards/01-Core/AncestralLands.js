const ProvinceCard = require('../../provincecard.js');

class AncestralLands extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            targetLocation: 'province',
            condition: () => this.game.currentConflict && this.game.currentConflict.type === 'political',
            effect: ability.effects.modifyProvinceStrength(5)
        });
    }
}

AncestralLands.id = 'ancestral-lands';

module.exports = AncestralLands;
