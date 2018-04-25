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
                gameAction: 'bow',
                cardCondition: (card, context) => card.isParticipating() && card.controller !== context.player
            },
            message: '{0} uses {1} to give 1 fate to {3}, forcing them to bow {2}',
            messageItems: context => context.player.opponent
        });
    }
}

DojiGiftGiver.id = 'doji-gift-giver';

module.exports = DojiGiftGiver;
