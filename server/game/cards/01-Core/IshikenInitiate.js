const DrawCard = require('../../drawcard.js');

class IshikenInitiate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyBothSkills(() => this.getNoOfClaimedRings())
        });
    }

    getNoOfClaimedRings() {
        let claimedRings = Object.values(this.game.rings).filter(ring => ring.isConsideredClaimed());
        return claimedRings.length;
    }
}

IshikenInitiate.id = 'ishiken-initiate';

module.exports = IshikenInitiate;
