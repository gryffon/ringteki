const DrawCard = require('../../drawcard.js');

class Sashimono extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => (
                this.game.currentConflict &&
                this.game.currentConflict.type === 'military'
            ),
            effect: ability.effects.doesNotBow
        });
    }

    canAttach(card) {
        if(!card.hasTrait('bushi')) {
            return false;
        }

        return super.canAttach(card);
    }
}

Sashimono.id = 'sashimono';

module.exports = Sashimono;
