const DrawCard = require('../../drawcard.js');
const { Players, PlayTypes } = require('../../Constants');

class IsawaTadaka extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: Players.Opponent,
            match: player => !this.game.rings.earth.isConsideredClaimed(player),
            effect: ability.effects.playerCannot({
                cannot: PlayTypes.PlayFromHand,
                restricts: 'copiesOfDiscardEvents'
            })
        });
    }
}

IsawaTadaka.id = 'isawa-tadaka';

module.exports = IsawaTadaka;
