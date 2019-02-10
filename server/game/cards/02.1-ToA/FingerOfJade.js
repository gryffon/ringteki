const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class FingerOfJade extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an ability',
            when: {
                onInitiateAbilityEffects: (event, context) => event.cardTargets.some(card => card === context.source.parent)
            },
            cost: AbilityDsl.costs.sacrificeSelf(),
            gameAction: AbilityDsl.actions.cancel()
        });
    }

    canAttach(card, context) {
        if(card.controller !== context.player) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

FingerOfJade.id = 'finger-of-jade';

module.exports = FingerOfJade;
