const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class VanguardWarrior extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice to put fate on one character',
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardType: CardTypes.Character,
                gameAction: ability.actions.placeFate()
            }
        });
    }
}

VanguardWarrior.id = 'vanguard-warrior';

module.exports = VanguardWarrior;
