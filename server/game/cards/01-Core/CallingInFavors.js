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
            effect: 'take control of {0} and attach it to {1}',
            effectItems: context => context.costs.dishonor,
            handler: context => {
                context.target.controller = context.player;
                if(context.player.canAttach(context.target, context.costs.dishonor)) {
                    context.player.attach(context.target, context.costs.dishonor);
                } else {
                    this.game.addMessage('{0} cannot be attached to {1} so it is discarded', context.target, context.costs.dishonor);
                    this.game.openEventWindow(GameActions.eventTo.discardFromPlay(context.target, context));
                }
            }
        });
    }
}

CallingInFavors.id = 'calling-in-favors';

module.exports = CallingInFavors;
