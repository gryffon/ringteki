const DrawCard = require('../../drawcard.js');

class IAmReady extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready a character',
            cost: ability.costs.discardFate(card => card.isFaction('unicorn') && card.bowed),
            message: '{0} uses {1}, discarding a fate to ready {2}',
            messageItems: context => [context.costs.discardFate],
            handler: context => this.game.applyGameAction(context, { ready: context.costs.discardFate })
        });
    }
}

IAmReady.id = 'i-am-ready';

module.exports = IAmReady;
