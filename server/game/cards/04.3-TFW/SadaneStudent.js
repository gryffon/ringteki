const DrawCard = require('../../drawcard.js');

class SadaneStudent extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => (
                this.game.rings.air.isConsideredClaimed(context.player) ||
                this.game.rings.fire.isConsideredClaimed(context.player)
            ),
            effect: ability.effects.modifyPoliticalSkill(2)
        });
    }
}

SadaneStudent.id = 'sadane-student';

module.exports = SadaneStudent;
