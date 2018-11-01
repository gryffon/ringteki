const DrawCard = require('../../drawcard.js');

class HaughtyMagistrate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            match: (card, context) => 
                card.getGlory() < context.source.getGlory() && card !== context.source,
            targetController: 'any',
            effect: ability.effects.cardCannot('countForResolution')
        });
    }
}

HaughtyMagistrate.id = 'haughty-magistrate';

module.exports = HaughtyMagistrate;
