const PlayerAction = require('./PlayerAction');
const MoveFateEvent = require('../Events/MoveFateEvent');

class TransferFateAction extends PlayerAction {
    constructor(amount = 1) {
        super('takeFate');
        this.amount = amount;
        this.effect = 'take ' + amount + ' fate from {0}';
        this.cost = 'giving ' + amount + ' fate to {0}';
    }

    canAffect(player, context) {
        return player.fate >= this.amount && super.canAffect(player, context);
    }

    getEvent(player, context) {
        return new MoveFateEvent({ context: context, player: player }, this.amount, player, player.opponent, this);
    }
}

module.exports = TransferFateAction;
