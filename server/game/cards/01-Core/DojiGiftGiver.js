const DrawCard = require('../../drawcard.js');

class DojiGiftGiver extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow a character',
            cost: ability.costs.giveFateToOpponent(1),
            condition: context => context.source.isParticipating() && context.player.opponent,
            target: {
                player: 'opponent',
                cardType: 'character',
                cardCondition: (card, context) => card.isParticipating() && card.controller !== context.player,
                gameAction: ability.actions.bow()
            }
        });
    }
}

DojiGiftGiver.id = 'doji-gift-giver';

module.exports = DojiGiftGiver;
