const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class SoshiIllusionist extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard status from character',
            cost: ability.costs.payFate(1),
            target: {
                cardType: CardTypes.Character,
                gameAction: ability.actions.discardStatusToken()
            }
        });
    }
}

SoshiIllusionist.id = 'soshi-illusionist';

module.exports = SoshiIllusionist;
