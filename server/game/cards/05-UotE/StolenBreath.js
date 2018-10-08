const DrawCard = require('../../drawcard.js');

class StolenBreath extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.cannotParticipateAsAttacker('political'),
                ability.effects.cannotParticipateAsDefender('political')
            ]
        });
    }

    canPlay(context) {
        if(this.game.currentConflict) {
            return false;
        }

        return super.canPlay(context);
    }
}

StolenBreath.id = 'stolen-breath';

module.exports = StolenBreath;
