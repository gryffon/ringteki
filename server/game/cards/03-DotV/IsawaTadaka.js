const DrawCard = require('../../drawcard.js');
const { Players, PlayTypes } = require('../../Constants');

class IsawaTadaka extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: Players.Opponent,
            condition: context => context.game.currentConflict && context.game.currentConflict.hasElement('earth') ||
                context.game.rings.earth.isConsideredClaimed(context.player),
            effect: ability.effects.playerCannot({
                cannot: PlayTypes.PlayFromHand,
                restricts: 'copiesOfDiscardEvents'
            })
        });
    }
}

IsawaTadaka.id = 'isawa-tadaka';

module.exports = IsawaTadaka;
