const DrawCard = require('../../drawcard.js');

class AgainstTheWaves extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow or ready a shugenja',
            target: {
                cardType: 'character',
                gameAction: [ability.actions.bow(), ability.actions.unbow()],
                cardCondition: card => card.hasTrait('shugenja')
            }
        });
    }
}

AgainstTheWaves.id = 'against-the-waves';

module.exports = AgainstTheWaves;
