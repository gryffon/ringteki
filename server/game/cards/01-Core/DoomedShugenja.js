const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class DoomedShugenja extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: Locations.Any,
            effect: ability.effects.playerCannot({
                cannot: 'placeFateWhenPlayingCharacter',
                restricts: 'source'
            })
        });
    }
}

DoomedShugenja.id = 'doomed-shugenja';

module.exports = DoomedShugenja;
