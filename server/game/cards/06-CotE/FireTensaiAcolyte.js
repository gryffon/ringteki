const DrawCard = require('../../drawcard.js');
const AbilitDsl = require('../../abilitydsl');
const { Elements } = require('../../Constants');

class FireTensaiAcolyte extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: () => !this.game.isDuringConflict(Elements.Fire),
            effect: AbilitDsl.effects.cardCannot('declareAsAttacker')
        });
    }
}

FireTensaiAcolyte.id = 'fire-tensai-acolyte';

module.exports = FireTensaiAcolyte;
