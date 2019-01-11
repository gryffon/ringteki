const DrawCard = require('../../drawcard.js');

class BattleMaidenRecruit extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => (
                this.game.rings.water.isConsideredClaimed(context.player) ||
                this.game.rings.void.isConsideredClaimed(context.player)
            ),
            effect: ability.effects.modifyMilitarySkill(2)
        });
    }
}

BattleMaidenRecruit.id = 'battle-maiden-recruit';

module.exports = BattleMaidenRecruit;
