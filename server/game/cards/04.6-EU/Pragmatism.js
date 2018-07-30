
const DrawCard = require('../../drawcard.js');

class Pragmatism extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.whileAttached({
            condition: context => context.player.isLessHonorableThanOpponent(),
            effect: [
                ability.effects.modifyMilitarySkill(1),
                ability.effects.modifyPoliticalSkill(1),
                ability.effects.cardCannot('honor'),
                ability.effects.cardCannot('dishonor')
            ]
        });
    }
}

Pragmatism.id = 'pragmatism'; // This is a guess at what the id might be - please check it!!!

module.exports = Pragmatism;
