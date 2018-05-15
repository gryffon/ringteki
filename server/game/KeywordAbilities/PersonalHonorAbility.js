const TriggeredAbility = require('../triggeredability.js');

class PersonalHonorAbility extends TriggeredAbility {
    constructor(game, card) {
        super(game, card, 'forcedinterrupt', {
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source && 
                                                      context.source.allowGameAction('affectedByHonor') && 
                                                      (context.source.isHonored || context.source.isDishonored)
            },
            title: card.name + '\'s Personal Honor',
            printedAbility: false,
            effect: '{1} {2} 1 honor due to {0}\'s personal honor',
            effectArgs: context => [context.player, context.source.isHonored ? 'gains' : 'loses'],
            handler: context => {
                if(context.source.isHonored) {
                    this.game.applyGameAction(context, { gainHonor: context.player });
                } else if(context.source.isDishonored) {
                    this.game.applyGameAction(context, { loseHonor: context.player });
                }
            }
        });
    }
}

module.exports = PersonalHonorAbility;
