const DrawCard = require('../../drawcard.js');

class ArtisanAcademy extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Make top card of conflict deck playable',
            phase: 'conflict',
            condition: () => this.controller.conflictDeck.size() > 0,
            handler: () => {
                let topCard = this.controller.conflictDeck.first();
                this.game.addMessage('{0} uses {1} to reveal the top card of their conflict deck: {2}', this.controller, this, topCard);
                if(topCard.type === 'event') {
                    topCard.abilities.reactions.forEach(reaction => reaction.registerEvents());
                }
                this.lastingEffect(ability => ({
                    until: {
                        onCardMoved: event => event.card === topCard && event.originalLocation === 'conflict deck',
                        onPhaseEnded: event => event.phase === 'conflict',
                        onDeckShuffled: event => event.player === this.controller && event.deck === 'conflict deck'
                    },
                    effect: [
                        ability.effects.showTopConflictCard,
                        ability.effects.canPlayFromOwn('conflict deck')
                    ]
                }));
            }
        });
    }
}

ArtisanAcademy.id = 'artisan-academy';

module.exports = ArtisanAcademy;
