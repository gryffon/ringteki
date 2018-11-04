const DrawCard = require('../../drawcard.js');

class GuestOfHonor extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: 'opponent',
            effect: ability.effects.playerCannot({
                cannot: 'play',
                restricts: 'events'
            })
        });
    }
}

GuestOfHonor.id = 'guest-of-honor';

module.exports = GuestOfHonor;
