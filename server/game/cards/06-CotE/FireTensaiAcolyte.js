const DrawCard = require('../../drawcard.js');

class FireTensaiAcolyte extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.player.opponent && !this.game.isDuringConflict('fire'),
            effect: ability.effects.cardCannot('declareAsAttacker')
        });
    }
}

FireTensaiAcolyte.id = 'fire-tensai-acolyte';

module.exports = FireTensaiAcolyte;
