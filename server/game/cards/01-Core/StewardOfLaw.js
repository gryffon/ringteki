const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class StewardOfLaw extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Any,
            match: card => card.getType() === 'character',
            effect: ability.effects.cardCannot('becomeDishonored')
        });
    }
}

StewardOfLaw.id = 'steward-of-law';

module.exports = StewardOfLaw;

