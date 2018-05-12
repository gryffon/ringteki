const DrawCard = require('../../drawcard.js');

class IntimidatingHida extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Make opponent lose honor',
            when: {
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player.opponent
            },
            handler: context => {
                let otherPlayer = this.game.getOtherPlayer(context.player);
                this.game.addMessage('{0} uses {1} to make {2} lose an honor', context.player, this, otherPlayer);
                this.game.addHonor(otherPlayer, -1);
            }
        });
    }
}

IntimidatingHida.id = 'intimidating-hida';

module.exports = IntimidatingHida;
