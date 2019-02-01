const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class ForgedEdict extends DrawCard {
    setupCardAbilities(ability) {
        this.wouldInterrupt({
            title: 'Cancel an event',
            when: {
                onInitiateAbilityEffects: event => event.card.type === CardTypes.Event
            },
            cannotBeMirrored: true,
            cost: ability.costs.dishonor(card => card.hasTrait('courtier')),
            effect: 'cancel {1}',
            effectArgs: context => context.event.card,
            handler: context => context.cancel()
        });
    }
}

ForgedEdict.id = 'forged-edict';

module.exports = ForgedEdict;
