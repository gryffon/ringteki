const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class SeppunGuardsman extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: Locations.Any,
            condition: context => context.player.opponent && context.player.opponent.imperialFavor !== '',
            effect: ability.effects.cannotParticipateAsAttacker()
        });
    }
}

SeppunGuardsman.id = 'seppun-guardsman';

module.exports = SeppunGuardsman;
