const DrawCard = require('../../drawcard.js');
const { Durations, TargetModes, Phases } = require('../../Constants');

class SecludedShrine extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Count a ring as claimed',
            when: {
                onPhaseStarted: event => event.phase === Phases.Conflict
            },
            target: {
                mode: TargetModes.Ring,
                ringCondition: () => true,
                gameAction: ability.actions.ringLastingEffect(context => ({
                    duration: Durations.UntilEndOfPhase,
                    effect: ability.effects.considerRingAsClaimed(player => player === context.player)
                }))
            },
            effect: 'make it so that they are considered to have claimed {0} until the end of the phase'
        });
    }
}

SecludedShrine.id = 'secluded-shrine';

module.exports = SecludedShrine;
