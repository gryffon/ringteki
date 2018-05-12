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
            effect: '{0} draws a card due to {1}\'s Sincerity',
            effectArgs: context => context.source,
            handler: context => context.player.drawCardsToHand(1)
        });
    }
}

module.exports = SincerityAbility;
