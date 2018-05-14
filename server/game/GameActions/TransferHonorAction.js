const PlayerAction = require('./PlayerAction');

class TransferHonorAction extends PlayerAction {
    constructor(amount = 1, afterBid = false) {
        super('takeHonor');
        this.amount = amount;
        this.afterBid = afterBid;
        this.effect = 'take ' + amount + ' honor from {0}';
        this.cost = 'giving ' + amount + ' honor to {0}';
    }

    canAffect(player, context) {
        return player.opponent && super.canAffect(player, context);
    }

    getEvent(player, context) {
        let params = {
            context: context, 
            player: player, 
            amount: this.amount, 
            afterBid: this.afterBid
        };
        return super.createEvent('onTransferHonor', params, event => {
            event.player.honor -= event.amount;
            event.player.opponent.honor += event.amount;
            context.game.checkWinCondition(event.player);
            context.game.checkWinCondition(event.player.opponent);
        });
    }
}

module.exports = TransferHonorAction;
