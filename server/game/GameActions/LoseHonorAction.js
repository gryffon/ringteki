const PlayerAction = require('./PlayerAction');
const { EventNames } = require('../Constants');

class LoseHonorAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.dueToUnopposed = false;
    }

    setup() {
        super.setup();
        this.name = 'loseHonor';
        this.effectMsg = 'make {0} lose ' + this.amount + ' honor';
        this.cost = 'losing ' + this.amount + ' honor';
    }

    canAffect(player, context) {
        return this.amount === 0 ? false : super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent(EventNames.OnModifyHonor, { player: player, amount: -this.amount, dueToUnopposed: this.dueToUnopposed, context: context }, event => player.modifyHonor(event.amount));
    }
}

module.exports = LoseHonorAction;
