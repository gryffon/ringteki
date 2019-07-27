const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class ImplacableMagistrate extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute((conflict, context) => {
                return card => !card.isHonored && card !== context.source;
            })
        });
    }
}

ImplacableMagistrate.id = 'implacable-magistrate';

module.exports = ImplacableMagistrate;
