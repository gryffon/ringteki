const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class UnveiledDestiny extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => !!context.source.controller.role,
            effect: AbilityDsl.effects.addElementAsAttacker(card => card.controller.role.getElement())
        });
    }
}

UnveiledDestiny.id = 'unveiled-destiny';

module.exports = UnveiledDestiny;
