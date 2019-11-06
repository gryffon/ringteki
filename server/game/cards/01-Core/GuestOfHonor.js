const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class GuestOfHonor extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Opponent,
            effect: ability.effects.playerCannot({
                cannot: 'play',
                restricts: 'events'
            })
        });
    }
}

GuestOfHonor.id = 'guest-of-honor';

module.exports = GuestOfHonor;
