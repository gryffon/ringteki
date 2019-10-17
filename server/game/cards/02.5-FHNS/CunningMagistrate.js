const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class CunningMagistrate extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            effect: AbilityDsl.effects.cannotContribute((conflict, context) => {
                return card => card.isDishonored && card !== context.source;
            })
        });
    }
}

CunningMagistrate.id = 'cunning-magistrate';

module.exports = CunningMagistrate;
