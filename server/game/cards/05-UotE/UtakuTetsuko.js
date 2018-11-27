const DrawCard = require('../../drawcard.js');
const { Players, PlayTypes } = require('../../Constants');

class UtakuTetsuko extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            targetType: 'player',
            targetController: Players.Opponent,
            effect: ability.effects.increaseCost({
                amount: 1,
                playingType: PlayTypes.PlayFromHand
            })
        });
    }
}

UtakuTetsuko.id = 'utaku-tetsuko';

module.exports = UtakuTetsuko;
