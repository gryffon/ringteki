const DrawCard = require('../../drawcard.js');

class PrudentChallenger extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            initiateDuel: context => ({
                type: 'military',
                resolutionHandler: (winner, loser) => this.resolutionHandler(context, winner, loser)
            })
        });
    }

    resolutionHandler(context, winner, loser) {
        if(loser) {
            this.game.addMessage('{0} wins the duel and {1} loses', winner, loser);
            if(loser.attachments.size() > 0) {
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose an attachment to discard',
                    context: context,
                    cards: loser.attachments.sortBy(card => card.name),
                    cardHandler: card => {
                        this.game.addMessage('{0} chooses to discard {1}', context.player, card);
                        this.game.applyGameAction(context, { discardCard: card });
                    }
                });
            }
        } else {
            this.game.addMessage('{0} wins the duel but there is no loser', winner);
        }
    }
}

PrudentChallenger.id = 'prudent-challenger';

module.exports = PrudentChallenger;
