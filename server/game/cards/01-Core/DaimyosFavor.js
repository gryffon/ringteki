const DrawCard = require('../../drawcard.js');

class DaimyosFavor extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow to reduce attachment cost',
            cost: ability.costs.bowSelf(),
            effect: 'reduce the cost of the next attachment they play on {0} by 1',
            handler: context => context.source.untilEndOfPhase(ability => ({
                effect: ability.effects.reduceCost({
                    playingTypes: 'play',
                    amount: 1,
                    match: card => card.type === 'attachment',
                    targetCondition: target => target === context.source.parent,
                    limit: ability.limit.fixed(1)
                })
            }))
        });
    }
    
    canAttach(card) {
        if(card.controller !== this.controller) {
            return false;
        }
        return super.canAttach(card);
    }
}

DaimyosFavor.id = 'daimyo-s-favor';

module.exports = DaimyosFavor;
