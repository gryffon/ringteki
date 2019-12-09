const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class KeeperInitiate extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Put this into play',
            when: {
                onClaimRing: (event, context) => event.player === context.player && context.player.role &&
                                                 (event.conflict && event.conflict.elements.some(element => context.player.role.hasTrait(element)) || context.player.role.hasTrait(event.ring.element))
            },
            location: [Locations.Provinces, Locations.DynastyDiscardPile],
            gameAction: ability.actions.putIntoPlay(),
            then: {
                gameAction: ability.actions.placeFate()
            }
        });
    }
}

KeeperInitiate.id = 'keeper-initiate';

module.exports = KeeperInitiate;
