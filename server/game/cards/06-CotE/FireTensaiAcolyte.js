const DrawCard = require('../../drawcard.js');
const { Elements } = require('../../Constants');

class FireTensaiAcolyte extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.canOnlyBeDeclaredAsAttackerWithElement(Elements.Fire)
        });
    }
}

FireTensaiAcolyte.id = 'fire-tensai-acolyte';

module.exports = FireTensaiAcolyte;
