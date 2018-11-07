const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class SilverTonguedMagistrate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            match: (card, context) => card.fate === 0 && card !== context.source,
            targetController: Players.Any,
            effect: ability.effects.cardCannot('countForResolution')
        });
    }
}

SilverTonguedMagistrate.id = 'silver-tongued-magistrate';

module.exports = SilverTonguedMagistrate;
