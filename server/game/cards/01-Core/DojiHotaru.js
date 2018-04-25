const DrawCard = require('../../drawcard.js');

class DojiHotaru extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Resolve ring effect',
            when: {
                onClaimRing: (event, context) => event.conflict && context.source.isParticipating() && 
                                                 event.conflict.conflictType === 'political' && event.player === context.player
            },
            message: '{0} uses {1} to resolve the ring\'s effect again',
            handler: context => context.event.conflict.resolveRing(context.event.conflict.attackingPlayer, false)
        });
    }
}

DojiHotaru.id = 'doji-hotaru';

module.exports = DojiHotaru;
