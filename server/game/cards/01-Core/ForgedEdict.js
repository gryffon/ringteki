const DrawCard = require('../../drawcard.js');

class ForgedEdict extends DrawCard {
    setupCardAbilities(ability) {
        this.wouldInterrupt({
            title: 'Cancel an event',
            when: {
                onCardAbilityInitiated: event => event.card.type === 'event'
            },
            cost: ability.costs.dishonor(card => card.hasTrait('courtier')),
            effect: 'cancel {0}',
            effectArgs: context => context.event.card,
            handler: context => context.cancel()
        });
    }
}

ForgedEdict.id = 'forged-edict';

module.exports = ForgedEdict;
