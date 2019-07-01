const DrawCard = require('../../drawcard.js');
const { CardTypes, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class CommandRespect extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Take honor from opponent when they play an event',
            condition: context => context.game.isDuringConflict() && context.player.opponent &&
                context.player.hand.size() < context.player.opponent.hand.size(),
            max: AbilityDsl.limit.perConflict(1),
            effect: 'force {1} to give them an honor as an additional cost to play an event until the end of the conflict',
            effectArgs: context => context.player.opponent,
            gameAction: AbilityDsl.actions.playerLastingEffect(() => ({
                targetController: Players.Opponent,
                effect: AbilityDsl.effects.additionalCost(context =>
                    context.source.type === CardTypes.Event ? [AbilityDsl.costs.giveHonorToOpponent(1)] : []
                )
            }))
        });
    }
}

CommandRespect.id = 'command-respect';

module.exports = CommandRespect;
