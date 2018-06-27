const LoseHonorAction = require('./LoseHonorAction');

class ApplyUnopposedAction extends LoseHonorAction {
    setup() {
        super.setup();
        this.name = 'applyUnopposed';
        this.effectMsg = '{0} loses ' + this.amount + ' honor for  for not defending the conflict';
        this.cost = 'losing ' + this.amount + ' honor';
    }

    canAffect(player, context) {
        return this.amount === 0 ? false : super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('onApplyUnopposed', { player: player, amount: -this.amount, context: context }, event => player.modifyHonor(event.amount));
    }
}

module.exports = ApplyUnopposedAction;
