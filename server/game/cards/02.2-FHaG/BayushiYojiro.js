const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class BayushiYojiro extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Any,
            match: card => card.isParticipating(),
            effect: ability.effects.cardCannot('affectedByHonor')
        });
    }
}

BayushiYojiro.id = 'bayushi-yojiro';

module.exports = BayushiYojiro;
