const DrawCard = require('../../drawcard.js');

class ForGreaterGlory extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Put a fate on all your bushi in this conflict',
            when: {
                onBreakProvince: event => event.conflict.conflictType === 'military'
            },
            gameActions: ability.actions.placeFate().target(context => (
                context.event.conflict.attackers.filter(card => card.hasTrait('bushi'))
            )),
            max: ability.limit.perConflict(1)
        });
    }
}

ForGreaterGlory.id = 'for-greater-glory';

module.exports = ForGreaterGlory;
