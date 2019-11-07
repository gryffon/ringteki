const DrawCard = require('../../drawcard.js');
const { Players, PlayTypes } = require('../../Constants');

class UtakuTetsuko extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            targetController: Players.Opponent,
            effect: ability.effects.increaseCost({
                amount: 1,
                playingTypes: PlayTypes.PlayFromHand
            })
        });
    }
}

UtakuTetsuko.id = 'utaku-tetsuko';

module.exports = UtakuTetsuko;
