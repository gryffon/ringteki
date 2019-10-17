const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');

class EffectiveDeception extends ProvinceCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel triggered ability',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    context.source.isConflictProvince() &&
                    event.context.ability.isTriggeredAbility()
            },
            effect: 'cancel the effects of {1}\'s ability',
            effectArgs: context => context.event.card,
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}

EffectiveDeception.id = 'effective-deception';

module.exports = EffectiveDeception;
