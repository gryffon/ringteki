const TriggeredAbility = require('../triggeredability.js');

class PrideAbility extends TriggeredAbility {
    constructor(game, card) {
        super(game, card, 'forcedreaction', {
            when: {
                afterConflict: (event, context) => context.source.isParticipating() && context.source.hasPride() &&
                                                   ((event.conflict.winner === context.player && context.source.allowGameAction('honor', context)) ||
                                                   (event.conflict.loser === context.player && context.source.allowGameAction('dishonor', context)))
            },
            title: card.name + '\'s Pride',
            printedAbility: false,
            effect: '{0} is {1}honored due to their Pride',
            effectArgs: context => context.event.conflict.winner === context.player ? '' : 'dis',
            handler: context => {
                if(context.event.conflict.winner === context.player) {
                    this.game.applyGameAction(context, { honor: context.source });
                } else {
                    this.game.applyGameAction(context, { dishonor: context.source });
                }
            }
        });
    }
}

module.exports = PrideAbility;
