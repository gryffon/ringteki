const ProvinceCard = require('../../provincecard.js');

class FertileFields extends ProvinceCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw a card',
            gameAction: ability.actions.draw()
        });
    }
}

FertileFields.id = 'fertile-fields';

module.exports = FertileFields;
