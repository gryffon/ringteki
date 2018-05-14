const CardGameAction = require('./CardGameAction');

class SendHomeAction extends CardGameAction {
    constructor() {
        super('sendHome');
        this.effect = 'send {0} home';
    }

    canAffect(card, context) {
        if(!card.isParticipating()) {
            return false;
        }
        return super.canAffect(card, context);
    }
    /*
    getEventArray(context) {
        if(this.targets.length === 0) {
            return [];
        }
        let events = this.targets.map(card => this.getEvent(card, context));
        return events.concat(this.createEvent('onSendCharactersHome', { sendHomeEvents: events }));
    }
    */

    getEvent(card, context) {
        return super.createEvent('onCardSentHome', { card: card, context: context }, () => context.game.currentConflict.removeFromConflict(card));
    }
}

module.exports = SendHomeAction;
