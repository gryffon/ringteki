const TriggeredAbility = require('../triggeredability.js');
const { AbilityTypes } = require('../Constants');

class SincerityAbility extends TriggeredAbility {
    constructor(game, card) {
        super(game, card, AbilityTypes.ForcedInterrupt, {
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source &&
                                                      context.source.hasSincerity()
            },
            title: card.name + '\'s Sincerity',
            printedAbility: false,
            message: '{0} draws a card due to {1}\'s Sincerity',
            messageArgs: context => [context.player, context.source],
            handler: context => context.game.applyGameAction(context, { draw: context.player })
        });
    }

    isTriggeredAbility() {
        return false;
    }
}

module.exports = SincerityAbility;
