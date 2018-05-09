const CardGameAction = require('./CardGameAction');
const LeavesPlayEvent = require('../Events/LeavesPlayEvent');

class ReturnToDeckAction extends CardGameAction {
    constructor(bottom = false) {
        super('returnToDeck');
        this.effect = 'return {0} to the ' + (bottom ? 'bottom' : 'top') + ' of their deck';
        this.moveOptions = { bottom: bottom };
    }

    canAffect(card, context = this.context) {
        if(card.location !== 'play area') {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context = this.context) {
        let destination = card.isDynasty ? 'dynasty deck' : 'conflict deck';
        return new LeavesPlayEvent({ context: context, destination: destination, options: this.moveOptions }, card, this);
    }
}

module.exports = ReturnToDeckAction;
