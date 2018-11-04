const DrawCard = require('../../drawcard.js');

class BeastmasterMatriarch extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyMilitarySkill(card => this.getTwiceOpponentsClaimedRings(card.controller))
        });
    }

    getTwiceOpponentsClaimedRings(player) {
        if(!player.opponent) {
            return 0;
        }
        return 2 * player.opponent.getClaimedRings().length;
    }
}

BeastmasterMatriarch.id = 'beastmaster-matriarch';

module.exports = BeastmasterMatriarch;
