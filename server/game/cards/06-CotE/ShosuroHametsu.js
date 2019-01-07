const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class ShosuroHametsu extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search conflict deck for a poison card',
            cost: AbilityDsl.costs.payHonor(1),
            effect: 'search conflict deck to reveal a poison card and add it to their hand',
            gameAction: AbilityDsl.actions.deckSearch({
                cardCondition: card => card.hasTrait('poison'),
                reveal: true
            })
        });
    }
}

ShosuroHametsu.id = 'shosuro-hametsu';

module.exports = ShosuroHametsu;

