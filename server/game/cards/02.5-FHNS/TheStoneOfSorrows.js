const DrawCard = require('../../drawcard.js');

class TheStoneOfSorrows extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.parent && !context.source.parent.bowed,
            targetType: 'player',
            targetController: 'opponent',
            effect: ability.effects.playerCannot('takeFateFromRings')
        });
    }
}

TheStoneOfSorrows.id = 'the-stone-of-sorrows';

module.exports = TheStoneOfSorrows;
