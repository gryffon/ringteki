const DrawCard = require('../../drawcard.js');
const { Players, PlayTypes } = require('../../Constants');

class GuestOfHonor extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Opponent,
            effect: ability.effects.playerCannot({
                cannot: PlayTypes.PlayFromHand,
                restricts: 'events'
            })
        });
    }
}

GuestOfHonor.id = 'guest-of-honor';

module.exports = GuestOfHonor;
