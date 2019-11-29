const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class CaravanGuard extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.fateCostToAttack()
        });
    }
}

CaravanGuard.id = 'caravan-guard';

module.exports = CaravanGuard;

