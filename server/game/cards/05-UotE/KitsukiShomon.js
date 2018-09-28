const DrawCard = require('../../drawcard.js');
const ThenAbility = require('../../ThenAbility');

class KitsukiShomon extends DrawCard {
    setupCardAbilities(ability) {
        this.wouldInterrupt({
            title: 'Dishonor this character instead',
            when: {
                onCardDishonored: (event, context) =>
                    event.card.controller === context.player && !context.source.isDishonored &&
                    event.card !== context.source
            },
            effect: 'dishonor {0} instead of {1}',
            effectArgs: context => context.event.card,
            handler: context => {
                context.event.card = context.source;
                let thenAbility = new ThenAbility(this.game, this, { gameAction: ability.actions.ready() });
                let condition = event => !event.cancelled && event.card === context.source;
                context.event.window.addThenAbility([context.event], thenAbility, context, condition);
            }
        });
    }
}

KitsukiShomon.id = 'kitsuki-shomon';

module.exports = KitsukiShomon;
