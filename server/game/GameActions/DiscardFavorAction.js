const PlayerAction = require('./PlayerAction');

class DiscardFavorAction extends PlayerAction {
    constructor() {
        super('discardFavor');
        this.effect = 'make {0} lose the Imperial Favor';
        this.cost = 'discarding the Imperial Favor';
    }

    canAffect(player, context) {
        if(player.imperialFavor === '') {
            return false;
        }
        return super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('onDiscardFavor', { player: player, context: context }, () => player.loseImperialFavor());
    }
}

module.exports = DiscardFavorAction;
