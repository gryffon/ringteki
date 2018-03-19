const DrawCard = require('../../drawcard.js');

class KamiUnleashed extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Resolve ring effect',
            cost: ability.cost.sacrificeSelf(),
            condition: context => context.source.isAttacking(),
            handler: context => {
                this.game.addMessage('{0} sacrifices {1} to resolve the ring effect', context.player, context.source);
                this.game.currentconflict.resolveRing(context.player);
            }
        });
    }
}

KamiUnleashed.id = 'kami-unleashed';

module.exports = KamiUnleashed;