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
            initiateDuel: context => ({
                type: DuelTypes.Military,
                opponentChoosesDuelTarget: true,
                resolutionHandler: (winner) => this.resolutionHandler(context, winner)
            }),
            effect: 'initiate a military duel between {1} and {2}',
            effectArgs: (context) => [context.source, context.targets.duelTarget]
        });
    }

    resolutionHandler(context, winner) {
        if(winner === context.source) {
            this.game.addMessage('{0} sets both players to count 0 total skill for the conflict', winner);
            this.game.actions.playerLastingEffect({
                targetController: Players.Any,
                effect: AbilityDsl.effects.setConflictTotalSkill(0)
            }).resolve(null, context);
        }
    }
}

KakitaToshimoko.id = 'kakita-toshimoko';

module.exports = KakitaToshimoko;
