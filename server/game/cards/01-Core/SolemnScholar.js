const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class SolemnScholar extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow an attacking character',
            condition: context => this.game.rings.earth.isConsideredClaimed(context.player),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isAttacking(),
                gameAction: ability.actions.bow()
            }
        });
    }
}

SolemnScholar.id = 'solemn-scholar';

module.exports = SolemnScholar;
