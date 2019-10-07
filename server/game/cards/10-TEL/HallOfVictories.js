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
            }))
        });
    }
}

HallOfVictories.id = 'hall-of-victories';

module.exports = HallOfVictories;
