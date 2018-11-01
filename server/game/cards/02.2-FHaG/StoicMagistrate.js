const DrawCard = require('../../drawcard.js');

class StoicMagistrate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isDefending(),
            match: card => card.costLessThan(3),
            targetController: 'any',
            effect: ability.effects.cardCannot('countForResolution')
        });
    }
}

StoicMagistrate.id = 'stoic-magistrate';

module.exports = StoicMagistrate;
