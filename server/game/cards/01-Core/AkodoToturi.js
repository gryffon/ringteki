const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class AkodoToturi extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Resolve ring effect',
            when: {
                onClaimRing: (event, context) => this.game.isDuringConflict('military') && context.source.isParticipating() &&
                                                 event.player === context.player
            },
            gameAction: AbilityDsl.actions.resolveConflictRing()
        });
    }
}

AkodoToturi.id = 'akodo-toturi';

module.exports = AkodoToturi;
