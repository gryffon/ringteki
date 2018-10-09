const DrawCard = require('../../drawcard.js');

class LiarsMask extends DrawCard {
    setupCardAbilities(ability) {

    }

    canAttach(card, context) {
        if(context.player.honor > 6) {
            return false;
        }

        return super.canAttach(card, context);
    }
}

LiarsMask.id = 'liar-s-mask';

module.exports = LiarsMask;
