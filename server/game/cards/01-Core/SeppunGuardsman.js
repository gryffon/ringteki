const DrawCard = require('../../drawcard.js');

class SeppunGuardsman extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: context => context.player.opponent && context.player.opponent.imperialFavor !== '',
            effect: ability.effects.cannotParticipateAsAttacker()
        });
    }
}

SeppunGuardsman.id = 'seppun-guardsman';

module.exports = SeppunGuardsman;
