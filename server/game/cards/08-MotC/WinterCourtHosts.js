const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class WinterCourtHosts extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Draw a card.',
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event, context) => {
                    return event.player === context.player.opponent &&
                        context.source.isParticipating() &&
                        context.player.honor > context.player.opponent.honor;
                }
            },
            gameAction: AbilityDsl.actions.draw()
        });
    }
}

WinterCourtHosts.id = 'winter-court-hosts';
module.exports = WinterCourtHosts;

