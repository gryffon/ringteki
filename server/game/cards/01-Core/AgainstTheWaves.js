const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class AgainstTheWaves extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow or ready a shugenja',
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.hasTrait('shugenja'),
                gameAction: [ability.actions.bow(), ability.actions.ready()]
            }
        });
    }
}

AgainstTheWaves.id = 'against-the-waves';

module.exports = AgainstTheWaves;
