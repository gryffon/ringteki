const DrawCard = require('../../drawcard.js');

class HitoDistrict extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'province',
            condition: () => this.game.isDuringConflict('political'),
            match: (card, context) => card.isProvince && card.location === context.source.location,
            effect: ability.effects.cardCannot('initiateConflict')
        });
    }
}

HitoDistrict.id = 'hito-district';

module.exports = HitoDistrict;
