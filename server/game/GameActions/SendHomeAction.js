const CardGameAction = require('./CardGameAction');

class SendHomeAction extends CardGameAction {
    constructor() {
        super('sendHome');
        this.effect = 'send {0} home';
    }

    canAffect(card) {
        if(!card.isParticipating()) {
            return false;
        }
        return super.canAffect(card);
    }

    getEventArray() {
        if(this.cards.length === 0) {
            return [];
        }
        let events = this.cards.map(card => this.getEvent(card));
        return events.concat(this.createEvent('onSendCharactersHome', { sendHomeEvents: events }));
    }

    getEvent(card) {
        return super.createEvent('onCardSentHome', { card: card, context: this.context }, () => this.context.game.currentConflict.removeFromConflict(card));
    }
}

module.exports = SendHomeAction;
