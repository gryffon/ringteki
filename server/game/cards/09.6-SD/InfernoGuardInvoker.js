const DrawCard = require('../../drawcard.js');
const { CardTypes, Durations, Players, Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class InfernoGuardInvoker extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'honor this character',
            condition: context => context.game.isDuringConflict('military'),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating()
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.honor(context => ({ target: context.target})),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.target,
                    duration: Durations.UntilEndOfConflict,
                    location: [Locations.DynastyDiscardPile, Locations.PlayArea],
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            onBreakProvince: () => true
                        },
                        message: '{1} is discarded, burned to a pile of ash due to the delayed effect of {0}',
                        messageArgs: [context.source, context.target],
                        gameAction: AbilityDsl.actions.sacrifice({ target: context.target })
                    })
                }))
            ])
        });
    }
}

InfernoGuardInvoker.id = 'inferno-guard-invoker';

module.exports = InfernoGuardInvoker;
