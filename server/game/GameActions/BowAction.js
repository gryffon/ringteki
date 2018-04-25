const GameAction = require('./GameAction');

class BowAction extends GameAction {
    constructor() {
        super('bow');
    }

    canAffect(card) {
        if(card.location !== 'play area' || card.bowed) {
            return false;
        }
        return card.allowGameAction(this.action, this.context);
    }

    getEvent(card) {
        let event = this.context.game.getEvent('onCardBowed',);
    }
}
