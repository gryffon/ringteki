const DrawCard = require('../../drawcard.js');

class WayOfTheDragon extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentConditions({
            limit: 1,
            myControl: true
        });

        this.whileAttached({
            effect: ability.effects.increaseLimitOnAbilities()
        });
    }
}

WayOfTheDragon.id = 'way-of-the-dragon';

module.exports = WayOfTheDragon;

