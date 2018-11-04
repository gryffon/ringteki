const DrawCard = require('../../drawcard.js');

class ImplacableMagistrate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            match: (card, context) => !card.isHonored && card !== context.source,
            targetController: 'any',
            effect: ability.effects.cardCannot('countForResolution')
        });
    }
}

ImplacableMagistrate.id = 'implacable-magistrate';

module.exports = ImplacableMagistrate;
