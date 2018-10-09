const DrawCard = require('../../drawcard.js');

class HenshinDisciple extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.rings.air.isConsideredClaimed(this.controller)) ||
                (this.game.isDuringConflict('air') && this.game.currentConflict.ring.contested),
            match: this,
            effect: ability.effects.modifyPoliticalSkill(2)
        });
        this.persistentEffect({
            condition: () => (
                this.game.rings.earth.isConsideredClaimed(this.controller)) ||
                (this.game.isDuringConflict('earth') && this.game.currentConflict.ring.contested),
            match: this,
            effect: ability.effects.modifyMilitarySkill(2)
        });
        this.persistentEffect({
            condition: () => (
                this.game.rings.fire.isConsideredClaimed(this.controller)) ||
                (this.game.isDuringConflict('fire') && this.game.currentConflict.ring.contested),
            match: this,
            effect: ability.effects.addKeyword('pride')
        });
    }
}

HenshinDisciple.id = 'henshin-disciple';

module.exports = HenshinDisciple;
