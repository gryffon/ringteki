const TriggeredAbility = require('../triggeredability.js');

class SincerityAbility extends TriggeredAbility {
    constructor(game, card) {
        super(game, card, 'forcedinterrupt', {
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source && 
                                                      context.source.hasSincerity()
            },
            title: card.name + '\'s Sincerity',
            printedAbility: false,
            effect: '{1} draws a card due to {0}\'s Sincerity',
            effectArgs: context => context.player,
            handler: context => context.game.applyGameAction(context, { draw: context.player })
        });
    }
}

module.exports = SincerityAbility;
