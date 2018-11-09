const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class ChikaiOrderProtector extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.persistentEffect({
            condition: context => context.source.isDefending() && context.player.cardsInPlay.any(card => card.getType() === CardTypes.Character && card.isParticipating() && (card.hasTrait('courtier') || card.hasTrait('shugenja'))),
            effect: ability.effects.doesNotBow()
        });
    }
}

ChikaiOrderProtector.id = 'chikai-order-protector';

module.exports = ChikaiOrderProtector;
