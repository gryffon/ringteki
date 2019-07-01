const DrawCard = require('../../drawcard.js');
const { Locations, Decks, Phases, Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class ArtisanAcademy extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Make top card of conflict deck playable',
            phase: Phases.Conflict,
            condition: context => context.player.conflictDeck.size() > 0,
            effect: 'reveal the top card of their conflict deck',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => {
                let topCard = context.player.conflictDeck.first();
                return {
                    duration: Durations.Custom,
                    until: {
                        onCardMoved: event => event.card === topCard && event.originalLocation === Locations.ConflictDeck,
                        onPhaseEnded: event => event.phase === Phases.Conflict,
                        onDeckShuffled: event => event.player === context.player && event.deck === Decks.ConflictDeck
                    },
                    effect: [
                        AbilityDsl.effects.showTopConflictCard(),
                        AbilityDsl.effects.canPlayFromOwn(Locations.ConflictDeck, [topCard])
                    ]
                };
            })
        });
    }
}

ArtisanAcademy.id = 'artisan-academy';

module.exports = ArtisanAcademy;
