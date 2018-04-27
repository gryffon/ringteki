const ProvinceCard = require('../../provincecard.js');

class ManicuredGarden extends ProvinceCard {
    setupCardAbilities() {
        // GainFateAction ?
        this.action({
            title: 'Gain 1 fate',
            condition: context => this.game.currentConflict && this.game.currentConflict.conflictProvince === context.source,
            effect: 'gain 1 fate',
            handler: context => context.player.modifyFate(1)
        });
    }
}

ManicuredGarden.id = 'manicured-garden';

module.exports = ManicuredGarden;
