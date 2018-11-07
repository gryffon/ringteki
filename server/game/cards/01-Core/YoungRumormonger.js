const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class YoungRumormonger extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Honor/dishonor a different character',
            when: {
                onCardHonored: event => event.gameAction.name === 'honor',
                onCardDishonored: event => event.gameAction.name === 'dishonor'
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card !== context.event.card && card.controller === context.event.card.controller &&
                                                  card.allowGameAction(context.event.gameAction.name, context)
            },
            effect: '{1} {0} instead of {2}',
            effectArgs: context => [context.event.gameAction.name, context.event.card],
            handler: context => context.event.card = context.target
        });
    }
}

YoungRumormonger.id = 'young-rumormonger';

module.exports = YoungRumormonger;
