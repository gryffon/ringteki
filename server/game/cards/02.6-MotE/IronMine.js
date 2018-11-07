const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class IronMine extends DrawCard {
    setupCardAbilities(ability) {
        this.wouldInterrupt({
            title: 'Prevent a character from leaving play',
            when: {
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.type === CardTypes.Character &&
                                                      context.source.allowGameAction('sacrifice', context)
            },
            effect: 'prevent {1} from leaving play',
            effectArgs: context => context.event.card,
            handler: context => {
                context.event.window.addEvent(ability.actions.sacrifice().getEvent(context.source, context));
                // add a check to refill this province once the triggering ability resolves
                context.event.context.refillProvince(context.source.controller, context.source.location);
                context.cancel();
            }
        });
    }
}

IronMine.id = 'iron-mine';

module.exports = IronMine;
