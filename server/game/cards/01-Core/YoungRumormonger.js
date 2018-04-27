const DrawCard = require('../../drawcard.js');

class YoungRumormonger extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Honor/dishonor a different character',
            when: {
                onCardHonored: event => event.gameAction.action === 'honor',
                onCardDishonored: event => event.gameAction.action === 'dishonor'
            },
            target: {
                cardType: 'character',
                gameAction: context => context.event.gameAction,
                cardCondition: (card, context) => card !== context.event.card && card.controller === context.event.card.controller
            },
            effect: '{1} {0} instead of {2}',
            effectItems: context => [context.event.gameAction.action, context.event.card],
            handler: context => {
                context.event.gameAction.card = context.target;
                let newEvent = context.event.gameAction.getEvent();
                context.event.getResult = () => newEvent.getResult();
                context.event.window.addEvent(newEvent);
                context.cancel();
            } 
        });
    }
}

YoungRumormonger.id = 'young-rumormonger';

module.exports = YoungRumormonger;
