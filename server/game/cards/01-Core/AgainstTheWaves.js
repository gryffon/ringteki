const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class AgainstTheWaves extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow or ready a shugenja',
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.hasTrait('shugenja'),
                gameAction: [AbilityDsl.actions.bow(), AbilityDsl.actions.ready()]
            }
        });
    }
}

AgainstTheWaves.id = 'against-the-waves';

module.exports = AgainstTheWaves;
