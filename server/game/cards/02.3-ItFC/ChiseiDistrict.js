const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class ChiseiDistrict extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: Locations.Provinces,
            condition: () => this.game.isDuringConflict('military'),
            match: (card, context) => card.isProvince && card.location === context.source.location,
            effect: ability.effects.cardCannot('initiateConflict')
        });
    }
}

ChiseiDistrict.id = 'chisei-district'; // This is a guess at what the id might be - please check it!!!

module.exports = ChiseiDistrict;
