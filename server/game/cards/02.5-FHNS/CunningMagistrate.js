const DrawCard = require('../../drawcard.js');

class CunningMagistrate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            match: (card, context) => card.isDishonored && card !== context.source,
            targetController: 'any',
            effect: ability.effects.cardCannot('countForResolution')
        });
    }
}

CunningMagistrate.id = 'cunning-magistrate';

module.exports = CunningMagistrate;
