const DrawCard = require('../../drawcard.js');

class ChiseiDistrict extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetLocation: 'province',
            condition: () => ['province 1', 'province 2', 'province 3', 'province 4'].includes(this.location) && !this.facedown,
            match: card => card.isProvince && card.location === this.location && card.controller === this.controller,
            effect: ability.effects.cardCannot('initiateConflict', () => this.game.currentConflict && this.game.currentConflict.type === 'military')
        });
    }
}

ChiseiDistrict.id = 'chisei-district'; // This is a guess at what the id might be - please check it!!!

module.exports = ChiseiDistrict;
