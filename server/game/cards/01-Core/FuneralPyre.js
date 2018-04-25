const DrawCard = require('../../drawcard.js');

class FuneralPyre extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice a character to draw',
            cost: ability.costs.sacrifice(card => card.type === 'character'),
            handler: context => {
                this.game.addMessage('{0} uses {1}, sacrificing {2} to draw a card', context.player, context.source, context.costs.sacrifice);
                context.player.drawCardsToHand(1);
            }
        });
    }
}

FuneralPyre.id = 'funeral-pyre';

module.exports = FuneralPyre;
