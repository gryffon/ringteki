const StrongholdCard = require('../../strongholdcard.js');
const { Durations } = require('../../Constants');

class HisuMoriToride extends StrongholdCard {
    setupCardAbilities(ability) {

        this.reaction({
            title: 'Gain additional military conflict',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && event.conflict.conflictType === 'military' &&
                    context.game.currentConflict.hasMoreParticipants(context.player)
            },
            cost: [ability.costs.bowSelf(), ability.costs.sacrifice(card => card.hasTrait('cavalry'))],
            gameAction: ability.actions.playerLastingEffect({
                duration: Durations.UntilEndOfPhase,
                effect: ability.effects.additionalConflict('military')
            })
        });
    }
}

HisuMoriToride.id = 'hisu-mori-toride-unicorn';

module.exports = HisuMoriToride;
