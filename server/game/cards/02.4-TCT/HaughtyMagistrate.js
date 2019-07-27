const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class HaughtyMagistrate extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute((conflict, context) => {
                return card => card.getGlory() < context.source.getGlory() && card !== context.source;
            })
        });
    }
}

HaughtyMagistrate.id = 'haughty-magistrate';

module.exports = HaughtyMagistrate;
