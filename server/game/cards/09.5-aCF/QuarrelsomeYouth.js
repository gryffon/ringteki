const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class QuarrelsomeYouth extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Force opponent to discard a card',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.loser === context.player &&
                    context.source.isAttacking() &&
                    context.player.opponent &&
                    context.player.hand.size() < context.player.opponent.hand.size()
            },
            gameAction: AbilityDsl.actions.discardAtRandom({ amount: 1 })
        });
    }
}

QuarrelsomeYouth.id = 'quarrelsome-youth';

module.exports = QuarrelsomeYouth;
