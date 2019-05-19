const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes } = require('../../Constants');

class HonorableChallenger extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            initiateDuel: {
                type: DuelTypes.Military,
                message: '{0} will not bow as a result of this conflict\'s resolution',
                messageArgs: duel => duel.winner,
                gameAction: duel => AbilityDsl.actions.cardLastingEffect({
                    target: duel.winner,
                    effect: AbilityDsl.effects.doesNotBow()
                })
            }
        });
    }
}

HonorableChallenger.id = 'honorable-challenger';

module.exports = HonorableChallenger;
