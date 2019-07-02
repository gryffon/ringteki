const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class AdeptOfShadows extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return to hand',
            cost: AbilityDsl.costs.payHonor(1),
            gameAction: AbilityDsl.actions.returnToHand()
        });
    }
}

AdeptOfShadows.id = 'adept-of-shadows';

module.exports = AdeptOfShadows;
