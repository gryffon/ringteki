const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class IAmReady extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready a character',
            cost: ability.costs.removeFate({
                cardType: CardTypes.Character,
                cardCondition: card => card.isFaction('unicorn') && card.bowed
            }),
            cannotBeMirrored: true,
            effect: 'ready {1}',
            effectArgs: context => context.costs.removeFate,
            handler: context => ability.actions.ready().resolve(context.costs.removeFate, context)
        });
    }
}

IAmReady.id = 'i-am-ready';

module.exports = IAmReady;
