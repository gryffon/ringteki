const DrawCard = require('../../drawcard.js');

class FireTensaiAcolyte extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.game.isDuringConflict('fire'),
            effect: ability.effects.cardCannot('declareAsAttacker')
        });
    }
}

FireTensaiAcolyte.id = 'fire-tensai-acolyte';

module.exports = FireTensaiAcolyte;
