const DrawCard = require('../../drawcard.js');

class ThirdTowerGuard extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => (
                this.game.rings.earth.isConsideredClaimed(context.player) ||
                this.game.rings.water.isConsideredClaimed(context.player)
            ),
            effect: ability.effects.modifyMilitarySkill(2)
        });
    }
}

ThirdTowerGuard.id = 'third-tower-guard';

module.exports = ThirdTowerGuard;
