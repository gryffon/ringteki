const ProvinceCard = require('../../provincecard.js');

class VassalFields extends ProvinceCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Make opponent lose 1 fate',
            gameAction: ability.actions.loseFate()
        });
    }
}

VassalFields.id = 'vassal-fields';

module.exports = VassalFields;
