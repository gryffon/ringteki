const DrawCard = require('../../drawcard.js');
const { Locations, Decks } = require('../../Constants');

class ArtisanAcademy extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Make top card of conflict deck playable',
            phase: 'conflict',
            condition: context => context.player.conflictDeck.size() > 0,
            effect: 'reveal the top card of their conflict deck',
            gameAction: ability.actions.playerLastingEffect(context => {
                let topCard = context.player.conflictDeck.first();
                return {
                    duration: 'lastingEffect',
                    until: {
                        onCardMoved: event => event.card === topCard && event.originalLocation === Locations.ConflictDeck,
                        onPhaseEnded: event => event.phase === 'conflict',
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

ArtisanAcademy.id = 'artisan-academy';

module.exports = ArtisanAcademy;
