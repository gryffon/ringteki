const DrawCard = require('../../drawcard.js');

class StudentOfWar extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.player.hasComposure(),
            effect: [
                ability.effects.cardCannot('removeFate'),
                ability.effects.cardCannot('discardFromPlay')
            ]
        });
    }
}

StudentOfWar.id = 'student-of-war';

module.exports = StudentOfWar;
