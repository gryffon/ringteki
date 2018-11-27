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

    canPlay(context, playType) {
        if(this.game.isDuringConflict()) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}

StolenBreath.id = 'stolen-breath';

module.exports = StolenBreath;
