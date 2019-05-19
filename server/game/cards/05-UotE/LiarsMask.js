const DrawCard = require('../../drawcard.js');

class LiarsMask extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard status token from attached character',
            gameAction: ability.actions.discardStatusToken(context => ({ target: context.source.parent.personalHonor }))
        });
    }

    canPlay(context, playType) {
        if(context.player.honor > 6) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}

LiarsMask.id = 'liar-s-mask';

module.exports = LiarsMask;
