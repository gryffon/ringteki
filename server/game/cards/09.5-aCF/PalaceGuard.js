const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class PalaceGuard extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot('declareAsAttacker')
        });
    }
}

PalaceGuard.id = 'palace-guard';

module.exports = PalaceGuard;
