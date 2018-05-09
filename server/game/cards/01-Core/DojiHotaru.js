const DrawCard = require('../../drawcard.js');

class DojiHotaru extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Resolve ring effect',
            when: {
                onClaimRing: (event, context) => this.game.isDuringConflict('political') && context.source.isParticipating() && 
                                                 event.player === context.player
            },
            gameActions: ability.actions.resolveRing(false)
        });
    }
}

DojiHotaru.id = 'doji-hotaru';

module.exports = DojiHotaru;
