const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class FingerOfJade extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.wouldInterrupt({
            title: 'Cancel an ability',
            when: {
                onInitiateAbilityEffects: (event, context) => event.cardTargets.some(card => card === context.source.parent)
            },
            cost: AbilityDsl.costs.sacrificeSelf(),
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}

FingerOfJade.id = 'finger-of-jade';

module.exports = FingerOfJade;
