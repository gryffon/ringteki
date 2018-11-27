const DrawCard = require('../../drawcard.js');

class Pacifism extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.cannotParticipateAsAttacker('military'),
                ability.effects.cannotParticipateAsDefender('military')
            ]
        });
    }

    canPlay(context, playType) {
        if(this.game.currentConflict) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}

Pacifism.id = 'pacifism';

module.exports = Pacifism;
