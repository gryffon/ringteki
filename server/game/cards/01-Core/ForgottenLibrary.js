const DrawCard = require('../../drawcard.js');
const { Phases } = require('../../Constants');

class ForgottenLibrary extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Draw a card',
            when: {
                onPhaseStarted: event => event.phase === Phases.Draw
            },
            gameAction: ability.actions.draw()
        });
    }
}

ForgottenLibrary.id = 'forgotten-library';

module.exports = ForgottenLibrary;
