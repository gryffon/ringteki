const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes } = require('../../Constants');

class MirumotoDojo extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            initiateDuel: {
                type: DuelTypes.Military,
                message: '{0} 1 fate from {1}{2}{3}{4}',
                messageArgs: duel => [
                    duel.winner && duel.winner.hasTrait('duelist') ? 'discard' : 'move',
                    duel.loser,
                    duel.winner && duel.winner.hasTrait('duelist') ? '' : ' to ',
                    duel.loser && duel.loser.owner,
                    duel.winner && duel.winner.hasTrait('duelist') ? '' : '\'s pool'
                ],
                gameAction: duel => AbilityDsl.actions.removeFate({
                    target: duel.loser,
                    recipient: duel.winner && !duel.winner.hasTrait('duelist') && duel.loser && duel.loser.owner
                })
            }
        });
    }
}

MirumotoDojo.id = 'mirumoto-dojo';

module.exports = MirumotoDojo;
