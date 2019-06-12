const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class BorderRider extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready this character',
            gameAction: AbilityDsl.actions.ready()
        });
    }
}

BorderRider.id = 'border-rider';

module.exports = BorderRider;


