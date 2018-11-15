const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class NobleSacrifice extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice honored character to discard dishonored one',
            cost: ability.costs.sacrifice(card => card.type === CardTypes.Character && card.isHonored),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isDishonored,
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}

NobleSacrifice.id = 'noble-sacrifice';

module.exports = NobleSacrifice;
