const DrawCard = require('../../drawcard.js');

class SpoilsOfWar extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Draw 3 cards and discard 1',
            max: ability.limit.perConflict(1),
            when: {
                afterConflict: (event, context) => event.conflict.conflictType === 'military' &&
                                                   event.conflict.winner === context.player &&
                                                   context.player.isAttackingPlayer()
            },
            gameAction: ability.actions.draw({ amount: 3 }),
            then: context => ({
                gameAction: ability.actions.chosenDiscard({ target: context.player })
            })
        });
    }
}

SpoilsOfWar.id = 'spoils-of-war';

module.exports = SpoilsOfWar;
