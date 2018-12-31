const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class KarmicBalance extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Shuffle and draw 4 new conflict cards',
            gameAction: [
                ability.actions.moveCard(context => ({
                    shuffle: true,
                    destination: Locations.ConflictDeck,
                    target: context.player.conflictDiscardPile.union(context.player.hand.value())
                })),
                ability.actions.moveCard(context => ({
                    shuffle: true,
                    destination: Locations.ConflictDeck,
                    target: context.player.opponent.conflictDiscardPile.union(context.player.opponent.hand.value())
                })),
                ability.actions.draw(context => ({ target: context.game.getPlayers(), amount: 4 })),
                ability.actions.moveCard(context => ({ target: context.source, destination: Locations.RemovedFromGame }))
            ],
            effect: 'shuffle hand and discard pile into conflict deck and draw 4 cards'
        });
    }

    canPlay(context) {
        if(context.player.opponent && context.player.showBid === context.player.opponent.showBid) {
            return super.canPlay(context);
        }
        return false;
    }
}

KarmicBalance.id = 'karmic-balance';

module.exports = KarmicBalance;
