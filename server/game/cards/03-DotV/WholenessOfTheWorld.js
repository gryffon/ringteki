const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class WholenessOfTheWorld extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Keep a claimed ring',
            when: {
                onReturnRing: (event, context) => event.ring.claimedBy === context.player.name
            },
            cannotBeMirrored: true,
            effect: 'prevent {1} from returning to the unclaimed pool',
            effectArgs: context => context.event.ring,
            gameAction: AbilityDsl.actions.cancel(),
            max: AbilityDsl.limit.perRound(1)
        });
    }
}

WholenessOfTheWorld.id = 'wholeness-of-the-world';

module.exports = WholenessOfTheWorld;
