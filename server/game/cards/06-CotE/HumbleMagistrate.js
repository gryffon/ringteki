const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');
const AbilityDsl = require('../.../abilitydsl.js');

class HumbleMagistrate extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            match: (card) => card.printedCost >= 4,
            targetController: Players.Any,
            effect: AbilityDsl.effects.cardCannot('countForResolution')
        });
    }
}

HumbleMagistrate.id = 'humble-magistrate';

module.exports = HumbleMagistrate;
