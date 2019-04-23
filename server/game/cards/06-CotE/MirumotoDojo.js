const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes } = require('../../Constants');

class MirumotoDojo extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            initiateDuel: {
                type: DuelTypes.Military,
                gameAction: duel => AbilityDsl.actions.removeFate({
                    target: duel.loser,
                    recipient: duel.winner && duel.winner.hasTrait('duelist') && duel.loser && duel.loser.owner
                })
            }
        });
    }

    resolutionHandler(context, winner, loser) {
        if(loser) {
            if(winner.hasTrait('duelist')) {
                this.game.addMessage('{0} loses the duel and has 1 fate discarded', loser);
                this.game.actions.removeFate().resolve(loser, context);
            } else {
                this.game.addMessage('{0} loses the duel and returns 1 fate to its owner\'s fate pool', loser);
                this.game.actions.removeFate({ recipient: loser.owner }).resolve(loser, context);
            }
        } else {
            this.game.addMessage('{0} wins the duel but there is no loser', winner);
        }
    }
}

MirumotoDojo.id = 'mirumoto-dojo';

module.exports = MirumotoDojo;
