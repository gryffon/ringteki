const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class MakerOfKeepsakes extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot('receiveDishonorToken')
        });
    }
}

MakerOfKeepsakes.id = 'maker-of-keepsakes';

module.exports = MakerOfKeepsakes;
