const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class MantisTenkinja extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Reduce cost of next event',
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === CardTypes.Event && event.player === context.player &&
                    event.context.ability.getReducedCost(event.context) > 0
            },
            cost: ability.costs.payHonor(1),
            effect: 'reduce the cost of their next event by 1',
            gameAction: ability.actions.playerLastingEffect(context => ({
                effect: ability.effects.reduceNextPlayedCardCost(1, card => card === context.event.card)
            }))
        });
    }
}

MantisTenkinja.id = 'mantis-tenkinja';

module.exports = MantisTenkinja;
