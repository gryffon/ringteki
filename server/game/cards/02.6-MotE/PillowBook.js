const DrawCard = require('../../drawcard.js');
const { Locations, Decks, Durations } = require('../../Constants');

class PillowBook extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Make top card of your conflict deck playable',
            condition: context => context.source.parent.isParticipating() && context.player.conflictDeck.size() > 0,
            effect: 'make the top card of their deck playable until the end of the conflict',
            gameAction: ability.actions.playerLastingEffect(context => {
                let topCard = context.player.conflictDeck.first();
                return {
                    duration: Durations.Custom,
                    until: {
                        onCardMoved: event => event.card === topCard && event.originalLocation === Locations.ConflictDeck,
                        onConflictFinished: () => true,
                        onDeckShuffled: event => event.player === context.player && event.deck === Decks.ConflictDeck
                    },
                    effect: [
                        ability.effects.showTopConflictCard(),
                        ability.effects.canPlayFromOwn(Locations.ConflictDeck, [topCard])
                    ]
                };
            })
        });
    }
}

PillowBook.id = 'pillow-book';

module.exports = PillowBook;
