const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class DojiGiftGiver extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow a character',
            cost: ability.costs.giveFateToOpponent(1),
            condition: context => context.source.isParticipating() && context.player.opponent,
            target: {
                player: Players.Opponent,
                cardType: 'character',
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.bow()
            }
        });
    }
}

DojiGiftGiver.id = 'doji-gift-giver';

module.exports = DojiGiftGiver;
