const Event = require('../Events/Event.js');

class GameAction {
    constructor(action, context) {
        this.action = action;
        this.context = context;
    }

    canAffect(card) {
    }

    condition()

    getEvent(card, name, params, handler) {
        let event = new Event(name, params, handler);
        event.card = card;
        event.context = this.context;
        event.gameAction = this;
    }
}

module.exports = GameAction;
