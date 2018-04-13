const DrawCard = require('../../drawcard.js');

class ShibaPeacemaker extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetLocation: 'any',
            match: this,
            effect: ability.effects.cardCannot('participateAsAttacker')
        });
    }
}

ShibaPeacemaker.id = 'shiba-peacemaker';

module.exports = ShibaPeacemaker;
