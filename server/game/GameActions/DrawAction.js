const PlayerAction = require('./PlayerAction');

class DrawAction extends PlayerAction {
    constructor(amount = 1) {
        super('draw');
        this.amount = amount;
        this.effect = 'draw {1} cards';
        this.effectArgs = () => {
            return this.amount;
        };
    }

    getDefaultTargets(context) {
        return context.player;
    }

    getEvent(player) {
        return super.createEvent('onDrawCards', { player: player, amount: this.amount }, () => player.drawCardsToHand(this.amount));
    }
}

module.exports = DrawAction;
