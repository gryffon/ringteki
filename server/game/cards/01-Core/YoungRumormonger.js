const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, EventNames } = require('../../Constants');

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
                                                  card.allowGameAction(context.event.name === EventNames.OnCardHonored ? 'honor' : 'dishonor', context)
            },
            effect: '{1} {0} instead of {2}',
            effectArgs: context => [context.event.name === EventNames.OnCardHonored ? 'honor' : 'dishonor', context.event.card],
            handler: context => {
                let actionName = context.event.name === EventNames.OnCardHonored ? 'honor' : 'dishonor';
                let newEvent = AbilityDsl.actions[actionName]().getEvent(context.target, context);
                context.event.replacementEvent = newEvent;
                context.event.window.addEvent(newEvent);
                context.cancel();
            }
        });
    }
}

YoungRumormonger.id = 'young-rumormonger';

module.exports = YoungRumormonger;
