const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class StoicMagistrate extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isDefending(),
            effect: AbilityDsl.effects.cannotContribute(() => {
                return card => card.costLessThan(3);
            })
        });
    }
}

StoicMagistrate.id = 'stoic-magistrate';

module.exports = StoicMagistrate;
