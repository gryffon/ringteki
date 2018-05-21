const TriggeredAbility = require('../triggeredability.js');

class CourtesyAbility extends TriggeredAbility {
    constructor(game, card) {
        super(game, card, 'forcedinterrupt', {
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source && 
                                                      context.source.hasCourtesy()
            },
            title: card.name + '\'s Courtesy',
            printedAbility: false,
            effect: '{1} gains a fate due to {0}\'s Courtesy',
            effectArgs: context => context.source,
            handler: context => this.game.applyGameAction(context, { gainFate: context.player })
        });
    }
}

module.exports = CourtesyAbility;
