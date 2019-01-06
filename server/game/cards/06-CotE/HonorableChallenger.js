const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class HonorableChallenger extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            initiateDuel: context => ({
                type: 'military',
                resolutionHandler: (winner) => this.resolutionHandler(context, winner)
            })
        });
    }

    resolutionHandler(context, winner) {
        this.game.addMessage('{0} wins the duel and will not bow as a result of this conflict\'s resolution', winner);
        this.game.actions.cardLastingEffect({ effect: AbilityDsl.effects.doesNotBow() }).resolve(winner, context);
    }
}

HonorableChallenger.id = 'honorable-challenger';

module.exports = HonorableChallenger;
