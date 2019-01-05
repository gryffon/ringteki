const PlayerAction = require('./PlayerAction');
const { EventNames } = require('../Constants');

class GainHonorAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'gainHonor';
        this.effectMsg = 'gain ' + this.amount + ' honor';
    }

    canAffect(player, context) {
        return this.amount === 0 ? false : super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        return super.createEvent(EventNames.OnModifyHonor, { player: player, amount: this.amount, context: context }, event => player.modifyHonor(event.amount));
    }
}

module.exports = GainHonorAction;
