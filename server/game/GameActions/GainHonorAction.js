const PlayerAction = require('./PlayerAction');

class GainHonorAction extends PlayerAction {
    constructor(amount = 1) {
        super('gainHonor');
        this.amount = amount;
        this.effect = 'gain ' + amount + ' honor';
    }

    getDefaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        return super.createEvent('onModifyHonor', { player: player, amount: this.amount }, () => player.modifyHonor(this.amount));
    }
}

module.exports = GainHonorAction;
