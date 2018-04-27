const DrawCard = require('../../drawcard.js');

class FavoredNiece extends DrawCard {
    setupCardAbilities(ability) {
        // DrawAction?
        this.action({
            title: 'Discard then draw a card',
            limit: ability.limit.perRound(2),
            cost: ability.costs.discardFromHand(),
            effect: 'draw a card', 
            handler: context => context.player.drawCardsToHand(1)
        });
    }
}

FavoredNiece.id = 'favored-niece';

module.exports = FavoredNiece;
