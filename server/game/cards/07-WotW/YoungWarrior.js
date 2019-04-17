const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class YoungWarrior extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.conflictRecord.filter(record => record.completed).length === 0,
            effect: [
                AbilityDsl.effects.mustBeDeclaredAsAttacker(),
                AbilityDsl.effects.mustBeDeclaredAsDefender()
            ]
        });
    }
}

YoungWarrior.id = 'young-warrior';

module.exports = YoungWarrior;
