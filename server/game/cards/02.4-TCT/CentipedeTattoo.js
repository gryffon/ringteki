const DrawCard = require('../../drawcard.js');

class CentipedeTattoo extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentConditions({
            trait: 'monk'
        });

        this.whileAttached({
            effect: ability.effects.addKeyword('tattooed')
        });
        this.whileAttached({
            condition: () => this.parent.isParticipating() && this.game.currentConflict.loser === this.parent.controller,
            effect: ability.effects.doesNotBow()
        });
    }
}

CentipedeTattoo.id = 'centipede-tattoo';

module.exports = CentipedeTattoo;
