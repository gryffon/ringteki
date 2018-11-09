const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class ImplacableMagistrate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            match: (card, context) => !card.isHonored && card !== context.source,
            targetController: Players.Any,
            effect: ability.effects.cardCannot('countForResolution')
        });
    }
}

ImplacableMagistrate.id = 'implacable-magistrate';

module.exports = ImplacableMagistrate;
