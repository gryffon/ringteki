const CardGameAction = require('./CardGameAction');
const LeavesPlayEvent = require('../Events/LeavesPlayEvent');

class ReturnToDeckAction extends CardGameAction {
    setDefaultProperties() {
        this.location = 'play area';
        this.ignoreLocation = false;
        this.bottom = false;
        this.shuffle = false;
    }

    setup() {
        this.name = 'returnToDeck';
        this.targetType = ['character', 'attachment', 'event', 'holding'];
        this.effectMsg = 'return {0} to the ' + (this.bottom ? 'bottom' : 'top') + ' of their deck';
        this.cost = this.shuffle ? 'reshuffling {0} into their deck' : 'returning {0} to their deck';
    }

    canAffect(card, context) {
        if(!this.ignoreLocation && card.location !== this.location) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let destination = card.isDynasty ? 'dynasty deck' : 'conflict deck';
        if(card.location === 'play area') {
            return new LeavesPlayEvent({ context: context, destination: destination, options: { bottom: this.bottom, shuffle: this.shuffle } }, card, this);
        }
        return super.createEvent('onMoveCard', { card: card, context: context }, event => {
            if(card.location.includes('province')) {
                event.window.refillProvince(card.controller, card.location, context);
            }
            card.owner.moveCard(card, destination, { bottom: this.bottom });
            if(this.shuffle) {
                if(destination === 'dynasty deck') {
                    card.owner.shuffleDynastyDeck();
                } else {
                    card.owner.shuffleConflictDeck();
                }
            }
        });
    }
}

module.exports = ReturnToDeckAction;
