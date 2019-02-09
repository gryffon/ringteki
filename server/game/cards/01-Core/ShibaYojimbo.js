const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations } = require('../../Constants');

class ShibaYojimbo extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel ability',
            when: {
                onInitiateAbilityEffects: (event, context) => event.context.ability.isTriggeredAbility() && event.cardTargets.some(card => (
                    card.hasTrait('shugenja') && card.controller === context.player && card.location === Locations.PlayArea)
                )
            },
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}

ShibaYojimbo.id = 'shiba-yojimbo';

module.exports = ShibaYojimbo;
