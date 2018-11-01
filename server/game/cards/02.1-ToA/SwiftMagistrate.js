const DrawCard = require('../../drawcard.js');

class SwiftMagistrate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            match: (card, context) => card.fate > 0 && card !== context.source,
            targetController: 'any',
            effect: ability.effects.cardCannot('countForResolution')
        });
    }
}

SwiftMagistrate.id = 'swift-magistrate';

module.exports = SwiftMagistrate;
