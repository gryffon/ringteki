const { EventNames } = require('../../Constants.js');
const EventRegistrar = require('../../eventregistrar.js');
const DrawCard = require('../../drawcard.js');
const { CardTypes, Durations, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class InfernoGuardInvoker extends DrawCard {
    setupCardAbilities() {
        this.provinceBroken = false;
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnBreakProvince, EventNames.OnConflictDeclared]);

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
                    duration: Durations.UntilEndOfPhase,
                    target: context.target,
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            onConflictFinished: () => this.provinceBroken
                        },
                        message: '{1} is discarded, burned to a pile of ash due to the delayed effect of {0}',
                        messageArgs: [context.source, context.target],
                        gameAction: AbilityDsl.actions.sacrifice({ target: context.target })
                    })
                }))
            ])
        });
    }

    onBreakProvince() {
        this.provinceBroken = true;
    }

    onConflictDeclared() {
        this.provinceBroken = false;
    }
}

InfernoGuardInvoker.id = 'inferno-guard-invoker';

module.exports = InfernoGuardInvoker;
