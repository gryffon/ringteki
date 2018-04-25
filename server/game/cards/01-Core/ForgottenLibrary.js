const DrawCard = require('../../drawcard.js');

class ForgottenLibrary extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Draw a card',
            when: {
                onPhaseStarted: event => event.phase === 'draw'
            },
            message: '{0} uses {1} to draw a card',
            handler: context => context.player.drawCardsToHand(1)
        });
    }
}

ForgottenLibrary.id = 'forgotten-library';

module.exports = ForgottenLibrary;
