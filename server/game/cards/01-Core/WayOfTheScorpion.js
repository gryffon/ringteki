const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class WayOfTheScorpion extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Dishonor a participating character',
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating() && !card.isFaction('scorpion'),
                gameAction: ability.actions.dishonor()
            }
        });
    }
}

WayOfTheScorpion.id = 'way-of-the-scorpion';

module.exports = WayOfTheScorpion;
