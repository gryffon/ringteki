const DrawCard = require('../../drawcard.js');

class HenshinDisciple extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => 
                this.game.rings.air.isConsideredClaimed(this.controller) ||
                this.game.rings.air.contested,
            match: this,
            effect: ability.effects.modifyPoliticalSkill(2)
        });
        this.persistentEffect({
            condition: () => 
                this.game.rings.earth.isConsideredClaimed(this.controller) ||
                this.game.rings.earth.contested,
            match: this,
            effect: ability.effects.modifyMilitarySkill(2)
        });
        this.persistentEffect({
            condition: () => 
                this.game.rings.fire.isConsideredClaimed(this.controller) ||
                this.game.rings.fire.contested,
            match: this,
            effect: ability.effects.addKeyword('pride')
        });
    }
}

HenshinDisciple.id = 'henshin-disciple';

module.exports = HenshinDisciple;
