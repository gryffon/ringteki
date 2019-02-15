const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class FuneralPyre extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice a character to draw',
            cost: ability.costs.sacrifice({ cardType: CardTypes.Character }),
            gameAction: ability.actions.draw()
        });
    }
}

FuneralPyre.id = 'funeral-pyre';

module.exports = FuneralPyre;
