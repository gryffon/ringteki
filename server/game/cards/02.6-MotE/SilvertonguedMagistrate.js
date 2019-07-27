const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class SilverTonguedMagistrate extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute((conflict, context) => {
                return card => card.fate === 0 && card !== context.source;
            })
        });
    }
}

SilverTonguedMagistrate.id = 'silver-tongued-magistrate';

module.exports = SilverTonguedMagistrate;
