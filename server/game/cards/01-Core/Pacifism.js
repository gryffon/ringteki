const DrawCard = require('../../drawcard.js');

class Pacifism extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => (
                this.game.currentConflict &&
                this.game.currentConflict.conflictType === 'military'
            ),
            effect: [
                ability.effects.cardCannot('participateAsAttacker'),
                ability.effects.cardCannot('participateAsDefender')
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

Pacifism.id = 'pacifism';

module.exports = Pacifism;
