const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const ThenAbility = require('../../ThenAbility');

class KitsukiShomon extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Dishonor this character instead',
            when: {
                onCardDishonored: (event, context) =>
                    event.card.controller === context.player &&
                    context.source.allowGameAction('dishonor', context) &&
                    event.card !== context.source
            },
            effect: 'dishonor {0} instead of {1}',
            effectArgs: context => context.event.card,
            handler: context => {
                let newEvent = AbilityDsl.actions.dishonor().getEvent(context.source, context);
                context.event.replacementEvent = newEvent;
                let thenAbility = new ThenAbility(this.game, this, { gameAction: AbilityDsl.actions.ready() });
                //let condition = event => !event.cancelled && event.card === context.source;
                context.events = [newEvent];
                context.event.window.addEvent(newEvent);
                context.event.window.addThenAbility(thenAbility, context);
                context.cancel();
            }
        });
    }
}

KitsukiShomon.id = 'kitsuki-shomon';

module.exports = KitsukiShomon;
