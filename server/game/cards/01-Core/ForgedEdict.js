const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class ForgedEdict extends DrawCard {
    setupCardAbilities(ability) {
        this.wouldInterrupt({
            title: 'Cancel an event',
            when: {
                onInitiateAbilityEffects: event => event.card.type === CardTypes.Event
            },
            cannotBeMirrored: true,
            cost: ability.costs.dishonor({ cardCondition: card => card.hasTrait('courtier') }),
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}

ForgedEdict.id = 'forged-edict';

module.exports = ForgedEdict;
