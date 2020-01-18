const DrawCard = require('../../drawcard.js');

class SeekerInitiate extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Look at top 5 cards',
            when: {
                onClaimRing: (event, context) => context.player.role && ((event.conflict && event.conflict.elements.some(element => context.player.role.hasTrait(element))) || context.player.role.hasTrait(event.ring.element)) &&
                                                 event.player === context.player && context.player.conflictDeck.size() > 0
            },
            effect: 'look at the top 5 cards of their conflict deck',
            gameAction: ability.actions.deckSearch({ amount: 5, reveal: false })
        });
    }
}

SeekerInitiate.id = 'seeker-initiate';

module.exports = SeekerInitiate;
