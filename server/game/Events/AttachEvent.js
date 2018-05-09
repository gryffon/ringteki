const Event = require('./Event.js');

class AttachEvent extends Event {
    constructor(params, card, fate, gameAction) {
        super('onCardEntersPlay', params);
        this.handler = this.entersPlay;
        this.card = card;
        this.fate = fate;
        this.gameAction = gameAction;
        this.originalLocation = card.location;
    }
    
    entersPlay() {
        // removeFromPile or removeAttachment
        // attachments.push, attachment.parent = card
        // 
    }
}

module.exports = AttachEvent;
