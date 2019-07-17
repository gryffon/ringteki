const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class HumbleMagistrate extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute(() => {
                return card => card.printedCost >= 4;
            })
        });
    }
}

HumbleMagistrate.id = 'humble-magistrate';

module.exports = HumbleMagistrate;
