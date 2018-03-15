const DrawCard = require('../../drawcard.js');

class EarthSpell extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Keep a claimed ring',
            when: {
                onReturnRing: (event, context) => event.ring.isConsideredClaimedBy(context.player)
            },
            canCancel: true,
            handler: context => {
                this.game.addMessage('{0} plays {1} to prevent the {2} from returning to the unclaimed pool', context.player, context.source, context.event.ring.element);
                context.cancel();
            }
        });
    }
}

EarthSpell.id = 'against-the-waves';

module.exports = EarthSpell;
