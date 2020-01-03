const DrawCard = require('../../drawcard.js');
const { Players, Phases } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class MirumotoMasashige extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Honor a character',
            when: {
                onPhaseStarted: (event, context) => event.phase === Phases.Conflict && context.player.opponent &&
                                                    context.player.cardsInPlay.size() < context.player.opponent.cardsInPlay.size()
            },
            target: {
                activePromptTitle: 'Choose a character to honor',
                controller: Players.Self,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}

MirumotoMasashige.id = 'mirumoto-masashige';

module.exports = MirumotoMasashige;
