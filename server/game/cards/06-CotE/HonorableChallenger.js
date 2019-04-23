const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes } = require('../../Constants');

class HonorableChallenger extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            initiateDuel: {
                type: DuelTypes.Military,
                gameAction: duel => AbilityDsl.actions.cardLastingEffect({
                    target: duel.winner,
                    effect: AbilityDsl.effects.doesNotBow()
                })
            }
        });
    }

    resolutionHandler(context, winner) {
        this.game.addMessage('{0} wins the duel and will not bow as a result of this conflict\'s resolution', winner);
        this.game.actions.cardLastingEffect({ effect: AbilityDsl.effects.doesNotBow() }).resolve(winner, context);
    }
}

HonorableChallenger.id = 'honorable-challenger';

module.exports = HonorableChallenger;
