const PlayerAction = require('./PlayerAction');

class LoseHonorAction extends PlayerAction {
    constructor(amount = 1) {
        super('loseHonor');
        this.amount = amount;
        this.effect = 'make {0} lose ' + amount + ' honor';
        this.cost = 'losing ' + amount + ' honor';
    }

    getEvent(player, context) {
        return super.createEvent('onModifyHonor', { player: player, amount: -this.amount, context: context }, event => player.modifyHonor(event.amount));
    }
}

module.exports = LoseHonorAction;
