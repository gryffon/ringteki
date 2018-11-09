const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class HaughtyMagistrate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            match: (card, context) =>
                card.getGlory() < context.source.getGlory() && card !== context.source,
            targetController: Players.Any,
            effect: ability.effects.cardCannot('countForResolution')
        });
    }
}

HaughtyMagistrate.id = 'haughty-magistrate';

module.exports = HaughtyMagistrate;
