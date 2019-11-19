const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class HallOfVictories extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            title: 'Gain an honor',
            when: {
                afterConflict: (event) => !!event.conflict.winner
            },
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            gameAction: AbilityDsl.actions.gainHonor(context => ({
                target: context.game.currentConflict.winner
            })),
            effect: 'make {1} gain 1 honor',
            effectArgs: context => [context.game.currentConflict.winner.name]
        });
    }
}

HallOfVictories.id = 'hall-of-victories';

module.exports = HallOfVictories;
