const DrawCard = require('../../drawcard.js');

class MotoYouth extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentConflict && this.game.currentConflict.type === 'military' && !this.game.militaryConflictCompleted,
            match: this,
            effect: ability.effects.modifyMilitarySkill(1)
        });
    }
}

MotoYouth.id = 'moto-youth';

module.exports = MotoYouth;
