const DrawCard = require('../../drawcard.js');
const { Locations, Players, TargetModes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class DaidojiHarrier extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Discard an opponent\'s card',
            when: {
                afterConflict: (event, context) => context.source.isParticipating() &&
                                                    event.conflict.winner === context.player &&
                                                    context.player.opponent && event.conflict.conflictType === 'military'
            },
            target: {
                activePromptTitle: 'Choose two cards to reveal',
                player: Players.Opponent,
                numCards: 2,
                mode: TargetModes.Exactly,
                location: Locations.Hand
            },
            gameAction: AbilityDsl.actions.cardMenu(context => ({
                cards: context.target,
                gameAction: AbilityDsl.actions.discardCard(),
                message: '{0} chooses {1} to be discarded from {2}',
                messageArgs: (card, player, cards) => [player, card, cards]
            }))
        });
    }
}

DaidojiHarrier.id = 'daidoji-harrier';

module.exports = DaidojiHarrier;
