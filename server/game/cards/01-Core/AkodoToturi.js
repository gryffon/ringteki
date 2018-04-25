const DrawCard = require('../../drawcard.js');

class AkodoToturi extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Resolve ring effect',
            when: {
                onClaimRing: (event, context) => (event.conflict && context.source.isParticipating() && 
                                                 event.conflict.conflictType === 'military' && event.player === context.player)
            },
            effect: 'resolve the ring\'s effect again',
            handler: context => context.event.conflict.resolveRing(context.event.conflict.attackingPlayer, false)
        });
    }
}

AkodoToturi.id = 'akodo-toturi';

module.exports = AkodoToturi;
