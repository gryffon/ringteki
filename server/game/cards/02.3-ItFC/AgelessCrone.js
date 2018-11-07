const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class AgelessCrone extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetType: 'player',
            targetController: Players.Any,
            effect: ability.effects.increaseCost({
                amount: 1,
                match: card => card.type === 'event'
            })
        });
    }
}

AgelessCrone.id = 'ageless-crone';

module.exports = AgelessCrone;
