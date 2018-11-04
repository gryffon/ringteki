const DrawCard = require('../../drawcard.js');

class OtomoCourtier extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: context => context.player.opponent && context.player.opponent.imperialFavor !== '',
            effect: ability.effects.cannotParticipateAsAttacker()
        });
    }
}

OtomoCourtier.id = 'otomo-courtier';

module.exports = OtomoCourtier;
