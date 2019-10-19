const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class IsawaTadaka extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: Players.Opponent,
            condition: context => context.game.rings.earth.contested ||
                context.game.rings.earth.isConsideredClaimed(context.player),
            effect: ability.effects.playerCannot({
                cannot: 'play',
                restricts: 'copiesOfDiscardEvents'
            })
        });
    }
}

IsawaTadaka.id = 'isawa-tadaka';

module.exports = IsawaTadaka;
