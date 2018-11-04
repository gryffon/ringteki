const DrawCard = require('../../drawcard.js');

class IkomaReservist extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => (
                this.game.rings.fire.isConsideredClaimed(context.player) ||
                this.game.rings.water.isConsideredClaimed(context.player)
            ),
            effect: ability.effects.modifyMilitarySkill(2)
        });
    }
}

IkomaReservist.id = 'ikoma-reservist';

module.exports = IkomaReservist;
