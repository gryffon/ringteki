const DrawCard = require('../../drawcard.js');

class ForgedEdict extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Cancel an event',
            when: {
                onCardAbilityInitiated: event => event.card.type === 'event'
            },
            canCancel: true,
            cost: ability.costs.dishonor(card => card.hasTrait('courtier')),
            message: '{0} plays {1}, dishonoring {2} to cancel {3}',
            messageItems: context => [context.costs.dishonor, context.event.card],
            handler: context => context.cancel()
        });
    }
}

ForgedEdict.id = 'forged-edict';

module.exports = ForgedEdict;
