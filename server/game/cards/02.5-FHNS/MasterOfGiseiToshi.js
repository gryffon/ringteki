const DrawCard = require('../../drawcard.js');
const { Durations, Players, TargetModes, Phases } = require('../../Constants');

class MasterOfGiseiToshi extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Prevent non-spell events from being played while contesting a ring',
            when: {
                onPhaseStarted: event => event.phase === Phases.Conflict
            },
            target: {
                mode: TargetModes.Ring,
                ringCondition: () => true
            },
            effect: 'prevent non-spell events from being played while {0} is contested',
            gameAction: ability.actions.playerLastingEffect(context => ({
                duration: Durations.UntilEndOfPhase,
                targetController: Players.Any,
                condition: () => this.game.currentConflict && this.game.currentConflict.ring === context.ring,
                effect: ability.effects.playerCannot({
                    cannot: 'play',
                    restricts: 'nonSpellEvents'
                })
            }))
        });
    }
}

MasterOfGiseiToshi.id = 'master-of-gisei-toshi';

module.exports = MasterOfGiseiToshi;
