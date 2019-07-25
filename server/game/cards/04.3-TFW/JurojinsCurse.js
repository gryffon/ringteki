const DrawCard = require('../../drawcard.js');
const FatePhase = require('../../gamesteps/fatephase.js');
const AbilityDsl = require('../../abilitydsl');
const { Durations, Phases } = require('../../Constants');

class JurojinsCurse extends DrawCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            title: 'Resolve a second fate phase',
            when: {
                onPhaseEnded: (event, context) => event.phase === Phases.Fate && !context.source.parent.bowed
            },
            effect: 'resolve a second fate phase after this',
            gameAction: AbilityDsl.actions.playerLastingEffect({
                duration: Durations.UntilEndOfRound,
                effect: AbilityDsl.effects.playerDelayedEffect({
                    when: {
                        onPhaseEnded: event => event.phase === Phases.Fate
                    },
                    message: '{0} takes hold!',
                    messageArgs: context => [context.source],
                    gameAction: AbilityDsl.actions.handler({
                        handler: context => context.game.queueStep(new FatePhase(context.game))
                    })
                })
            }),
            max: AbilityDsl.limit.perRound(1)
        });
    }
}

JurojinsCurse.id = 'jurojin-s-curse';

module.exports = JurojinsCurse;
