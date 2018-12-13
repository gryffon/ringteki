const PlayerAction = require('./PlayerAction');
const { EventNames } = require('../Constants');

class SetDialAction extends PlayerAction {
    setDefaultProperties() {
        this.value = 0;
    }

    setup() {
        super.setup();
        this.name = 'setDial';
        this.effectMsg = 'set {0}\'s dial to ' + this.value.toString();
    }

    canAffect(player, context) {
        return this.value > 0 && super.canAffect(player, context);
    }

    getEvent(player, context) {
        let params = {
            context: context,
            player: player,
            value: this.value
        };
        return super.createEvent(EventNames.OnSetHonorDial, params, event => {
            event.player.setShowBid(event.value);
        });
    }
}

module.exports = SetDialAction;
