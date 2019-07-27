const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class ANewName extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: [
                AbilityDsl.effects.addTrait('courtier'),
                AbilityDsl.effects.addTrait('bushi')
            ]
        });
    }
}

ANewName.id = 'a-new-name';

module.exports = ANewName;
