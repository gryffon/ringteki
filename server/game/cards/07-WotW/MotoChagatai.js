const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players } = require('../../Constants');


class MotoChagatai extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: () => true,
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}

MotoChagatai.id = 'moto-chagatai';

module.exports = MotoChagatai;
