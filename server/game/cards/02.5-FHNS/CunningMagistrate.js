const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class CunningMagistrate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            match: (card, context) => card.isDishonored && card !== context.source,
            targetController: Players.Any,
            effect: ability.effects.cardCannot('countForResolution')
        });
    }
}

CunningMagistrate.id = 'cunning-magistrate';

module.exports = CunningMagistrate;
