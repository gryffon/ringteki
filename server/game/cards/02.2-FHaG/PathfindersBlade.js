const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class PathfindersBlade extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel conflict province ability',
            when: {
                onInitiateAbilityEffects: (event, context) => context.source.parent.isAttacking() && event.card.isConflictProvince()
            },
            cost: AbilityDsl.costs.sacrificeSelf(),
            effect: 'cancel the effects of {1}\'s ability',
            effectArgs: context => context.event.card,
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}

PathfindersBlade.id = 'pathfinder-s-blade';

module.exports = PathfindersBlade;
