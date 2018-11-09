const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class TogashiTadakatsu extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: Players.Any,
            effect: ability.effects.playerCannot('chooseConflictRing')
        });
    }
}

TogashiTadakatsu.id = 'togashi-tadakatsu';

module.exports = TogashiTadakatsu;

