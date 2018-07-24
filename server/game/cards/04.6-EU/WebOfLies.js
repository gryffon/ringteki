const ProvinceCard = require('../../provincecard.js');

class WebOfLies extends ProvinceCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyProvinceStrength(context => -(this.getStrength() - (context.player.showBid * 2)))
        });
    }
}

WebOfLies.id = 'web-of-lies';

module.exports = WebOfLies;
