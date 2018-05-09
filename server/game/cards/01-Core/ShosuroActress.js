const DrawCard = require('../../drawcard.js');

class ShosuroActress extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put an opponent\'s character into play',
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.owner !== context.player && card.location.includes('discard pile') && 
                                                  card.getCost() <= 3 && !card.hasTrait('shinobi'),
                gameAction: ability.actions.putIntoConflict()
            }
        });
    }
}

ShosuroActress.id = 'shosuro-actress';

module.exports = ShosuroActress;
