const Event = require('./Event.js');
const { EventNames } = require('../Constants');

class MoveFateEvent extends Event {
    constructor(params, fate, origin, recipient, gameAction) {
        super(EventNames.OnMoveFate, params);
        this.handler = this.moveFate;
        this.origin = origin;
        this.recipient = recipient;
        this.fate = fate;
        this.gameAction = gameAction;
    }

    moveFate() {
        if(this.origin) {
            this.fate = Math.min(this.fate, this.origin.fate);
            this.origin.modifyFate(-this.fate);
        }
        if(this.recipient) {
            this.recipient.modifyFate(this.fate);
        }
    }
}

module.exports = MoveFateEvent;
