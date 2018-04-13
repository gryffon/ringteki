const DrawCard = require('../../drawcard.js');

class BeastmasterMatriarch extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyMilitarySkill(() => (this.controller.opponent ? (2 * this.controller.opponent.getClaimedRings().length) : 0))
        });
    }
}

BeastmasterMatriarch.id = 'beastmaster-matriarch';

module.exports = BeastmasterMatriarch;
