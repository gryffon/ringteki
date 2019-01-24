const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class HumbleMagistrate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            match: (card) => card.printedCost >= 4,
            targetController: Players.Any,
            effect: ability.effects.cardCannot('countForResolution')
        });
    }
}

HumbleMagistrate.id = 'humble-magistrate';

module.exports = HumbleMagistrate;