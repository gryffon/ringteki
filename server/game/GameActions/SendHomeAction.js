const CardGameAction = require('./CardGameAction');
const { CardTypes, EventNames } = require('../Constants');

class SendHomeAction extends CardGameAction {
    setup() {
        this.name = 'sendHome';
        this.targetType = [CardTypes.Character];
        this.effectMsg = 'send {0} home';
    }

    canAffect(card, context) {
        if(!super.canAffect(card, context)) {
            return false;
        }
        return card.isParticipating();
    }

    getEvent(card, context) {
        return super.createEvent(EventNames.OnSendHome, { card: card, context: context }, () => context.game.currentConflict.removeFromConflict(card));
    }
}

module.exports = SendHomeAction;
