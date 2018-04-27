const Event = require('../Events/Event.js');

class GameAction {
    constructor(name, context) {
        this.name = name;
        this.cards = [];
        this.context = context;
        this.effect = '';
        this.cost = '';
    }

    checkEventCondition(event) { // eslint-disable-line no-unused-vars
        return true;
    }

    getEventArray() {
        return [];
    }

    getEvent() {
        return this.createEvent('unnamedEvent', {});
    }

    createEvent(name, params, handler) {
        let event = new Event(name, params, handler, this);
        event.context = this.context;
        return event;
    }
}

module.exports = GameAction;
