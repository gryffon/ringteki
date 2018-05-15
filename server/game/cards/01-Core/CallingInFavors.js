const DrawCard = require('../../drawcard.js');

class CallingInFavors extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Take control of an attachment',
            cost: ability.costs.dishonor(() => true),
            target: {
                cardType: 'attachment',
                cardCondition: (card, context) => card.controller !== context.player && card.location === 'play area'
            },
            gameAction: ability.actions.attach().target(context => context.costs.dishonor).options(context => ({ 
                attachment: context.target, 
                discardOnFailure: true
            }))
        });
    }
}

CallingInFavors.id = 'calling-in-favors';

module.exports = CallingInFavors;
