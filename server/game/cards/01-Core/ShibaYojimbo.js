const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class ShibaYojimbo extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel ability',
            when: {
                onCardAbilityInitiated: (event, context) => event.context.ability.isTriggeredAbility() && event.cardTargets.some(card => (
                    card.hasTrait('shugenja') && card.controller === context.player && card.location === Locations.PlayArea)
                )
            },
            effect: 'cancel the effects of {1}',
            effectArgs: context => context.event.card,
            handler: context => context.cancel()
        });
    }
}

ShibaYojimbo.id = 'shiba-yojimbo';

module.exports = ShibaYojimbo;
