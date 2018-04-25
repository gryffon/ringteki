const DrawCard = require('../../drawcard.js');

class FavoredNiece extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard then draw a card',
            limit: ability.limit.perRound(2),
            cost: ability.costs.discardFromHand(),
            message: '{0} uses {1} to discard and draw a card', 
            handler: context => context.player.drawCardsToHand(1)
        });
    }
}

FavoredNiece.id = 'favored-niece';

module.exports = FavoredNiece;
