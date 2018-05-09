const PlayerAction = require('./PlayerAction');

class GainHonorAction extends PlayerAction {
    constructor(amount) {
        super('gainHonor');
        this.amount = amount;
        this.effect = 'gain ' + amount + ' honor';
    }

    getDefaultTargets(context) {
        return context.player;
    }

    getEvent(player, context = this.context) {
        return super.createEvent('onModifyHonor', { player: player, amount: this.amount }, () => context.game.addHonor(player, this.amount));
    }
}

module.exports = GainHonorAction;
