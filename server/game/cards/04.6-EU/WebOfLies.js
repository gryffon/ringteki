const ProvinceCard = require('../../provincecard.js');

class WebOfLies extends ProvinceCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.persistentEffect({
            effect: ability.effects.modifyBaseProvinceStrength(card => card.controller.showBid * 2)
        });
    }
}

WebOfLies.id = 'web-of-lies';

module.exports = WebOfLies;
