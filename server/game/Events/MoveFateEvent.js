const Event = require('./Event.js');
const { CardTypes } = require('../Constants');

class MoveFateEvent extends Event {
    constructor(params, fate, origin, recipient, gameAction) {
        super('onMoveFate', params);
        this.handler = this.moveFate;
        this.origin = origin;
        this.recipient = recipient;
        this.fate = fate;
        this.gameAction = gameAction;
    }

    checkCondition() {
        if(this.cancelled || this.resolved) {
            return;
        }

        if(this.origin) {
            if(this.origin.fate === 0 || this.origin === CardTypes.Character && !this.origin.allowGameAction('removeFate', this.context)) {
                this.cancel();
                return;
            }
        }

        if(this.recipient && this.recipient === CardTypes.Character && !this.recipient.allowGameAction('placeFate', this.context)) {
            this.cancel();
        }
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
