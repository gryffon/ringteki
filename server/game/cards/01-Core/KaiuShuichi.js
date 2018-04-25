const DrawCard = require('../../drawcard.js');

class KaiuShuichi extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Gain 1 fate',
            condition: context => context.source.isParticipating() && (context.player.getNumberOfHoldingsInPlay() > 0 ||
                                  (context.player.opponent && context.player.opponent.getNumberOfHoldingsInPlay() > 0)),
            message: '{0} uses {1} to gain 1 fate',
            handler: context => this.game.addFate(context.player, 1)
        });
    }
}

KaiuShuichi.id = 'kaiu-shuichi';

module.exports = KaiuShuichi;
