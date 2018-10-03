const PlayerAction = require('./PlayerAction');

class RefillFaceupAction extends PlayerAction {
    setDefaultProperties() {
        this.location = '';
    }

    setup() {
        super.setup();
        this.name = 'refil';
        this.effectMsg = 'refill its province faceup';
    }

    defaultTargets(context) {
        return context.player;
    }

    canAffect(player, context) {
        return super.canAffect(player, context) && !!this.location;
    }

    getEvent(player, context) {
        return super.createEvent('onRefillProvinceFaceup', { player, context }, () => {
            if(player.replaceDynastyCard(this.location) !== false) {
                context.game.queueSimpleStep(() => {
                    let card = player.getDynastyCardInProvince(this.location);
                    if(card) {
                        card.facedown = false;
                    }
                });
            }
        });
    }
}

module.exports = RefillFaceupAction;
