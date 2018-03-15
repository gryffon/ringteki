const DrawCard = require('../../drawcard.js');

class NeutralKeeper extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Resolve ring effect',
            cost: ability.cost.sacrificeSelf(),
            condition: context => context.source.isDefending(),
            handler: context => {
                this.game.addMessage('{0} sacrifices {1} to resolve the ring effect', context.player, context.source);
                this.game.currentconflict.resolveRing(context.player);
            }
        });
    }
}

NeutralKeeper.id = 'neutral-keeper'; // This is a guess at what the id might be - please check it!!!

module.exports = NeutralKeeper;
