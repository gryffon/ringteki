const StrongholdCard = require('../../strongholdcard.js');

class HisuMoriToride extends StrongholdCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain additional military conflict',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && event.conflict.conflictType === 'military' &&
                                                   event.conflict.skillDifference >= 5
            },
            gameAction: ability.actions.playerLastingEffect({
                duration: 'untilEndOfPhase',
                effect: ability.effects.additionalConflict('military')
            })
        });
    }
}

HisuMoriToride.id = 'hisu-mori-toride';

module.exports = HisuMoriToride;
