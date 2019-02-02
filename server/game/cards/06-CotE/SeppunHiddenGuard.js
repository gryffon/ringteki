const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class SeppunHiddenGuard extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel ability',
            when: {
                onCardAbilityInitiated: (event, context) => event.card.type === CardTypes.Character && event.cardTargets.some(card => (
                    card.isUnique() && card.controller === context.player && card.location === Locations.PlayArea)
                )
            },
            cost: AbilityDsl.costs.sacrificeSelf(),
            effect: 'cancel the effects of {1}',
            effectArgs: context => context.event.card,
            handler: context => {
                context.cancel();
                context.game.applyGameAction(context, { discardAtRandom: context.event.context.player });
            }
        });
    }
}

SeppunHiddenGuard.id = 'seppun-hidden-guard';

module.exports = SeppunHiddenGuard;
