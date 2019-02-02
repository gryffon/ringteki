const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');


class SeppunHiddenGuard extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel ability',
            when: {
                onCardAbilityInitiated: (event, context) => event.card.type === 'character' && event.cardTargets.some(card => (
                    card.isUnique() && card.controller === context.player && card.location === Locations.PlayArea)
                )
            },
            cost: AbilityDsl.costs.sacrificeSelf(),
            effect: 'cancel the effects of {1}',
            effectArgs: context => context.event.card,
            handler: context => {
                context.cancel();
                AbilityDsl.actions.discardAtRandom();
            }
        });
    }
}

SeppunHiddenGuard.id = 'seppun-hidden-guard';

module.exports = SeppunHiddenGuard;
