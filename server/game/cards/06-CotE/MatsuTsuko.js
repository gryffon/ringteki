const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class MatsuTsuko extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reduce the cost of the next card',
            condition: context => context.source.isAttacking() && context.player.opponent && context.player.opponent.honor < context.player.honor,
            gameAction: AbilityDsl.actions.playerLastingEffect({
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(2)
            })
        });
    }
}

MatsuTsuko.id = 'matsu-tsuko';

module.exports = MatsuTsuko;
