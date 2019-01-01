const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class TheStoneOfSorrows extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.parent && !context.source.parent.bowed,
            targetController: Players.Opponent,
            effect: ability.effects.playerCannot('takeFateFromRings')
        });
    }
}

TheStoneOfSorrows.id = 'the-stone-of-sorrows';

module.exports = TheStoneOfSorrows;
