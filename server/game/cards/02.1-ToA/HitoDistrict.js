const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class HitoDistrict extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: Locations.Provinces,
            condition: () => this.game.isDuringConflict('political'),
            match: (card, context) => card.isProvince && card.location === context.source.location,
            effect: ability.effects.cardCannot('initiateConflict')
        });
    }
}

HitoDistrict.id = 'hito-district';

module.exports = HitoDistrict;
