const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Durations } = require('../../Constants');

class HidaOUshi extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain additional military conflict',
            when: { afterConflict: (event, context) => context.player.isDefendingPlayer() && event.conflict.winner === context.player },
            gameAction: AbilityDsl.actions.playerLastingEffect({
                duration: Durations.UntilEndOfPhase,
                effect: AbilityDsl.effects.additionalConflict('military')
            }),
            max: AbilityDsl.limit.perPhase(1)
        });
    }
}

HidaOUshi.id = 'hida-o-ushi';

module.exports = HidaOUshi;
