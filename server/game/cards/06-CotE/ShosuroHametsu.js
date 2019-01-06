const DrawCard = require('../../drawcard.js');

class ShosuroHametsu extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search conflict deck for a Poison card',
            cost: ability.costs.payHonor(1),
            gameAction: ability.actions.deckSearch({
                cardCondition: card => card.hasTrait('poison'),
                reveal: true
            })
        });
    }
}

ShosuroHametsu.id = 'shosuro-hametsu';

module.exports = ShosuroHametsu;

