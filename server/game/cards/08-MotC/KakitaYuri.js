const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes, Durations, Players, ConflictTypes } = require('../../Constants');

class KakitaYuri extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Political duel to stop military conflicts',
            initiateDuel: {
                type: DuelTypes.Political,
                opponentChoosesDuelTarget: true,
                gameAction: duel => AbilityDsl.actions.playerLastingEffect(context => ({
                    targetController: duel.winner.controller === context.player ? Players.Opponent : Players.Self,
                    duration: Durations.UntilEndOfPhase,
                    effect: duel.winner ? AbilityDsl.effects.cannotDeclareConflictsOfType(ConflictTypes.Military) : []
                }))
            }
        });
    }
}

KakitaYuri.id = 'kakita-yuri';

module.exports = KakitaYuri;
