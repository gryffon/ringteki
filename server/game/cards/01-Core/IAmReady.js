const DrawCard = require('../../drawcard.js');

class IAmReady extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready a character',
            cost: ability.costs.discardFate(card => card.isFaction('unicorn') && card.bowed),
            effect: 'ready {1}',
            messageArgs: context => context.costs.discardFate,
            handler: context => ability.actions.ready().resolve(context.costs.discardFate, context)
        });
    }
}

IAmReady.id = 'i-am-ready';

module.exports = IAmReady;
