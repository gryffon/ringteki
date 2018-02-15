const Event = require('./Event.js');

class RemoveFateEvent extends Event {
    constructor(params) {
        super('onCardRemoveFate', params);
        this.handler = this.removeFate;
        this.gameAction = 'removeFate';
    }
    
    removeFate() {
        let fate = Math.min(this.fate, this.card.fate);
        this.card.fate -= fate;
        if(this.recipient && this.recipient.modifyFate) {
            this.recipient.modifyFate(fate);
        }
    }
}

module.exports = RemoveFateEvent;
