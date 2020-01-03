const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class KansenHaunt extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Resolve ring effect',
            when: {
                onClaimRing: (event, context) => context.player.honor < context.player.opponent.honor && context.player.isDefendingPlayer() && event.player === context.player
            },
            cost: AbilityDsl.costs.payHonor(2),
            gameAction: AbilityDsl.actions.resolveConflictRing()
        });
    }
}

KansenHaunt.id = 'kansen-haunt';

module.exports = KansenHaunt;
