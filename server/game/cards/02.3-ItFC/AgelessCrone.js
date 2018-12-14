const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class AgelessCrone extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Any,
            effect: ability.effects.increaseCost({
                amount: 1,
                match: card => card.type === CardTypes.Event
            })
        });
    }
}

AgelessCrone.id = 'ageless-crone';

module.exports = AgelessCrone;
