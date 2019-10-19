const DrawCard = require('../../drawcard.js');

class Sashimono extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentConditions({
            trait: 'bushi'
        });

        this.whileAttached({
            condition: () => this.game.isDuringConflict('military'),
            effect: ability.effects.doesNotBow()
        });
    }
}

Sashimono.id = 'sashimono';

module.exports = Sashimono;
