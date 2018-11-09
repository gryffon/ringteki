const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class OtomoCourtier extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: Locations.Any,
            condition: context => context.player.opponent && context.player.opponent.imperialFavor !== '',
            effect: ability.effects.cannotParticipateAsAttacker()
        });
    }
}

OtomoCourtier.id = 'otomo-courtier';

module.exports = OtomoCourtier;
