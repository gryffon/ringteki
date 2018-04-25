const DrawCard = require('../../drawcard.js');

class ICanSwim extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard a dishonored character',
            condition: context => context.player.opponent && context.player.showBid > context.player.opponent.showBid,
            target: {
                cardType: 'character',
                gameAction: 'discardFromPlay',
                cardCondition: (card, context) => card.isParticipating() && card.isDishonored && card.controller !== context.player 
            }
        });
    }
}

ICanSwim.id = 'i-can-swim';

module.exports = ICanSwim;
