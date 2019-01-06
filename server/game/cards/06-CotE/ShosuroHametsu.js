const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class ShosuroHametsu extends DrawCard {
    setupCardAbilities(AbilityDsl) {
        this.action({
            title: 'Search conflict deck for a Poison card',
            cost: AbilityDsl.costs.payHonor(1),
            gameAction: AbilityDsl.actions.deckSearch({
                cardCondition: card => card.hasTrait('poison'),
                reveal: true
            })
        });
    }
}

ShosuroHametsu.id = 'shosuro-hametsu';

module.exports = ShosuroHametsu;

