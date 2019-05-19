const DrawCard = require('../../drawcard.js');

class UnmatchedExpertise extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cardCannot('receiveDishonorToken')
        });
        this.forcedReaction({
            title: 'Removed after attached character loses a conflict',
            when: {
                afterConflict: (event, context) => context.source.parent.isParticipating() &&
                                                   event.conflict.loser === context.source.parent.controller
            },
            gameAction: ability.actions.discardFromPlay()
        });
    }
}

UnmatchedExpertise.id = 'unmatched-expertise';

module.exports = UnmatchedExpertise;
