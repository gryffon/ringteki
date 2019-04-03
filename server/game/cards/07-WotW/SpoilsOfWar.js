const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class SpoilsOfWar extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Draw 3 cards and discard 1',
            max: AbilityDsl.limit.perConflict(1),
            when: {
                afterConflict: (event, context) => event.conflict.conflictType === 'military' &&
                                                   event.conflict.winner === context.player &&
                                                   context.player.isAttackingPlayer()
            },
            gameAction: AbilityDsl.actions.draw({ amount: 3 }),
            then: context => ({
                gameAction: AbilityDsl.actions.chosenDiscard({ target: context.player })
            })
        });
    }
}

SpoilsOfWar.id = 'spoils-of-war';

module.exports = SpoilsOfWar;
