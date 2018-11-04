const DrawCard = require('../../drawcard.js');
const { Durations } = require('../../Constants');

class DaimyosFavor extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow to reduce attachment cost',
            cost: ability.costs.bowSelf(),
            effect: 'reduce the cost of the next attachment they play on {1} by 1',
            effectArgs: context => context.source.parent,
            gameAction: ability.actions.playerLastingEffect(context => ({
                duration: Durations.UntilEndOfPhase,
                effect: ability.effects.reduceCost({
                    playingTypes: 'playFromHand',
                    amount: 1,
                    match: card => card.type === 'attachment',
                    targetCondition: target => target === context.source.parent,
                    limit: ability.limit.fixed(1)
                })
            }))
        });
    }

    canAttach(card, context) {
        if(card.controller !== context.player) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

DaimyosFavor.id = 'daimyo-s-favor';

module.exports = DaimyosFavor;
