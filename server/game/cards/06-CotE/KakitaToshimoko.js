const DrawCard = require('../../drawcard.js');
const { DuelTypes, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class KakitaToshimoko extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Initiate a military duel',
            when: {
                afterConflict: (event, context) =>
                    context.source.isParticipating() &&
                    event.conflict.loser === context.player
            },
            initiateDuel: {
                type: DuelTypes.Military,
                opponentChoosesDuelTarget: true,
                message: 'both players count 0 total skill for the conflict',
                gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                    targetController: Players.Any,
                    effect: context.game.currentDuel.winner === context.source ? AbilityDsl.effects.setConflictTotalSkill(0) : []
                }))
            }
        });
    }
}

KakitaToshimoko.id = 'kakita-toshimoko';

module.exports = KakitaToshimoko;
