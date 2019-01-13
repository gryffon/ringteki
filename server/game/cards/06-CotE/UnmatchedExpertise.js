const DrawCard = require('../../drawcard.js');

class UnmatchedExpertise extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cardCannot('becomeDishonored')
        });
        this.forcedReaction({
            title: 'Removed after attached character loses a conflict',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.loser === context.source.parent
            },
            gameAction: ability.actions.discardFromPlay(context => ({ attachment: context.source }))
        });
    }
}

UnmatchedExpertise.id = 'unmatched-expertise';

module.exports = UnmatchedExpertise;
