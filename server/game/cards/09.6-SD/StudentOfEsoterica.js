const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class StudentOfEsoterica extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.alternateFatePool(card => {
                if(card.hasTrait('spell')) {
                    return this;
                }
                return false;
            })
        });
    }
}

StudentOfEsoterica.id = 'student-of-esoterica';

module.exports = StudentOfEsoterica;
