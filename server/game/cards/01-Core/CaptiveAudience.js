const DrawCard = require('../../drawcard.js');

class CaptiveAudience extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Change the conflict to military',
            cost: ability.costs.payHonor(1),
            condition: () => this.game.currentConflict && this.game.currentConflict.type === 'political',
            handler: () => {
                this.game.addMessage('{0} plays {1}, losing 1 honor to switch the conflict type to {2}', this.controller, this, 'military');
                this.game.currentConflict.switchType();
            }
        });
    }
}

CaptiveAudience.id = 'captive-audience';

module.exports = CaptiveAudience;
