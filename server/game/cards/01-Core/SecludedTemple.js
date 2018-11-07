const DrawCard = require('../../drawcard.js');
const { Players, Phases } = require('../../Constants');

class SecludedTemple extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Remove a fate from opponent\'s characters',
            when: {
                onPhaseStarted: (event, context) => event.phase === Phases.Conflict && context.player.opponent &&
                                                    context.player.cardsInPlay.size() < context.player.opponent.cardsInPlay.size()
            },
            target: {
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to remove a fate from',
                controller: Players.Opponent,
                gameAction: ability.actions.removeFate()
            }
        });
    }
}

SecludedTemple.id = 'secluded-temple';

module.exports = SecludedTemple;
