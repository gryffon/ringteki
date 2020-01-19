const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class ShintaoMonastery extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.additionalCardPlayed(1)
        });
    }
}

ShintaoMonastery.id = 'shintao-monastery';

module.exports = ShintaoMonastery;
