const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class YoungRumormonger extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Honor/dishonor a different character',
            when: {
                onCardHonored: () => true,
                onCardDishonored: () => true
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card !== context.event.card && card.controller === context.event.card.controller &&
                                                  card.allowGameAction(context.event.name === 'onCardHonored' ? 'honor' : 'dishonor', context)
            },
            effect: '{1} {0} instead of {2}',
            effectArgs: context => [context.event.name === 'onCardHonored' ? 'honor' : 'dishonor', context.event.card],
            handler: context => context.event.card = context.target
        });
    }
}

YoungRumormonger.id = 'young-rumormonger';

module.exports = YoungRumormonger;
