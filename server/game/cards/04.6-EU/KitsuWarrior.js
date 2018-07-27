const DrawCard = require('../../drawcard.js');

class KitsuWarrior extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: [
                ability.effects.modifyMilitarySkill(() => this.TwiceMilClaimedRings()),
                ability.effects.modifyPoliticalSkill(() => this.TwicePolClaimedRings())
            ]
        });
    }

    TwiceMilClaimedRings() {
        let MilclaimedRings = Object.values(this.game.rings).filter(ring => ring.isConsideredClaimed() & ring.isConflictType('military'));
        return 2 * MilclaimedRings.length;
    }
    TwicePolClaimedRings() {
        let PolclaimedRings = Object.values(this.game.rings).filter(ring => ring.isConsideredClaimed() & ring.isConflictType('political'));
        return 2 * PolclaimedRings.length;
    }
}

KitsuWarrior.id = 'kitsu-warrior';

module.exports = KitsuWarrior;
