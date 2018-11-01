const DrawCard = require('../../drawcard.js');

class ShibaPeacemaker extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.cannotParticipateAsAttacker()
        });
    }
}

ShibaPeacemaker.id = 'shiba-peacemaker';

module.exports = ShibaPeacemaker;
