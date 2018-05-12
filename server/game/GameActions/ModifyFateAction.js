const PlayerAction = require('./PlayerAction');

class ModifyFateAction extends PlayerAction {
    constructor(amount = 1) {
        let name = amount >= 0 ? 'gainFate' : 'spendFate';
        super(name);
        this.amount = amount;
        this.effect = 'gain ' + amount + ' fate';
        this.cost = 'paying ' + amount + ' fate';
    }

    getDefaultTargets(context) {
        return context.player;
    }

    canAffect(player, context) {
        return player.fate > -this.amount && super.canAffect(player, context);
    }

    getEvent(player) {
        return super.createEvent('onModifyFate', { player: player, amount: this.amount }, () => player.modifyFate(this.amount));
    }
}

module.exports = ModifyFateAction;
