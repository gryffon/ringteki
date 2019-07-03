const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class CaptiveAudience extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Change the conflict to military',
            cost: AbilityDsl.costs.payHonor(1),
            condition: () => this.game.isDuringConflict('political'),
            effect: 'switch the conflict type to {1}',
            effectArgs: () => 'military',
            handler: () => this.game.currentConflict.switchType()
        });
    }
}

CaptiveAudience.id = 'captive-audience';

module.exports = CaptiveAudience;
