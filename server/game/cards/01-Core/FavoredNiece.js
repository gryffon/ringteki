const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class FavoredNiece extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard then draw a card',
            limit: ability.limit.perRound(2),
            cost: ability.costs.discardCard(card => card.location === Locations.Hand),
            gameAction: ability.actions.draw()
        });
    }
}

FavoredNiece.id = 'favored-niece';

module.exports = FavoredNiece;
