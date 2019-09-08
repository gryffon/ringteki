const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class DojiHotaru2 extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition:  context => context.player && !!context.player.cardsInPlay.toArray().find(card => card.name === 'Doji Kuwanan'),
                message: '{1} is discarded from play as its controller controls {0}',
                messageArgs: context => [context.source, context.player.cardsInPlay.find(card => card.name === 'Doji Kuwanan')],
                gameAction: AbilityDsl.actions.discardFromPlay(context => ({
                    target: context.player.cardsInPlay.find(card => card.name === 'Doji Kuwanan')
                }))
            })
        });
        this.reaction({
            title: 'Gain 1 honor',
            when: {
                onCardPlayed: (event, context) => {
                    return context.source.isParticipating() &&
                        event.player === context.player.opponent;
                }
            },
            gameAction: AbilityDsl.actions.gainHonor(),
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            effect: 'gain 1 honor'
        });
    }
}

DojiHotaru2.id = 'doji-hotaru-2';

module.exports = DojiHotaru2;
