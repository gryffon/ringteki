const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class AggressiveMoto extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot('declareAsDefender')
        });
    }
}

AggressiveMoto.id = 'aggressive-moto';

module.exports = AggressiveMoto;
