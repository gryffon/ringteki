const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class ShosuroSadako extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isDishonored,
            effect: AbilityDsl.effects.honorStatusReverseModifySkill()
        });
    }
}

ShosuroSadako.id = 'shosuro-sadako';

module.exports = ShosuroSadako;
