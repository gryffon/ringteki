const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class StewardOfLaw extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Any,
            match: card => card.getType() === CardTypes.Character,
            effect: ability.effects.cardCannot('receiveDishonorToken')
        });
    }
}

StewardOfLaw.id = 'steward-of-law';

module.exports = StewardOfLaw;

