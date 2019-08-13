const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class StrideTheWaves extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move attached character in or out of the conflict',
            limit: AbilityDsl.limit.perRound(2),
            condition: context => this.game.isDuringConflict() &&
                this.game.rings.water.isConsideredClaimed(context.player),
            gameAction: AbilityDsl.actions.conditional({
                condition: (context, properties) => context.source.parent.inConflict,
                trueGameAction: AbilityDsl.actions.sendHome(context => ({
                    target: context.source.parent
                })),
                falseGameAction: AbilityDsl.actions.moveToConflict(context => ({
                    target: context.source.parent,
                }))
            }),
            effect: '{3} {2} {1}',
            effectArgs: (context, player) => [
                context.source.parent,
                context.source.parent.inConflict ? 'home' : 'into the conflict',
                context.source.parent.inConflict ? 'send' : 'move'
            ]
        })
    }
}

StrideTheWaves.id = 'stride-the-waves';

module.exports = StrideTheWaves;
