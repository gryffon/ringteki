const DrawCard = require('../../drawcard.js');

class HenshinDisciple extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context =>
                this.game.rings.air.isConsideredClaimed(context.player) ||
                (this.game.isDuringConflict('air') && this.game.currentConflict.ring.contested),
            effect: ability.effects.modifyPoliticalSkill(2)
        });
        this.persistentEffect({
            condition: context =>
                this.game.rings.earth.isConsideredClaimed(context.player) ||
                (this.game.isDuringConflict('earth') && this.game.currentConflict.ring.contested),
            effect: ability.effects.modifyMilitarySkill(2)
        });
        this.persistentEffect({
            condition: context =>
                this.game.rings.fire.isConsideredClaimed(context.player) ||
                (this.game.isDuringConflict('fire') && this.game.currentConflict.ring.contested),
            effect: ability.effects.addKeyword('pride')
        });
    }
}

HenshinDisciple.id = 'henshin-disciple';

module.exports = HenshinDisciple;
