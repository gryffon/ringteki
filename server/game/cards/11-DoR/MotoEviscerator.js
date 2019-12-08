const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class MotoEviscerator extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move this character to conflict',
            cost: AbilityDsl.costs.payHonor(1),
            gameAction: AbilityDsl.actions.moveToConflict()
        });
    }
}

MotoEviscerator.id = 'moto-eviscerator';

module.exports = MotoEviscerator;
