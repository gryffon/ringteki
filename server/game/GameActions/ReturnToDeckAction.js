const CardGameAction = require('./CardGameAction');
const LeavesPlayEvent = require('../Events/LeavesPlayEvent');
const { Locations, CardTypes } = require('../Constants');

class ReturnToDeckAction extends CardGameAction {
    setDefaultProperties() {
        this.location = Locations.PlayArea;
        this.ignoreLocation = false;
        this.bottom = false;
        this.shuffle = false;
    }

    setup() {
        this.name = 'returnToDeck';
        this.targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Event, CardTypes.Holding];
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
        let destination = card.isDynasty ? Locations.DynastyDeck : Locations.ConflictDeck;
        if(card.location === Locations.PlayArea) {
            return new LeavesPlayEvent({ context: context, destination: destination, options: { bottom: this.bottom, shuffle: this.shuffle } }, card, this);
        }
        return super.createEvent('onMoveCard', { card: card, context: context }, event => {
            if(card.location.includes('province')) {
                event.context.refillProvince(card.controller, card.location, context);
            }
            card.owner.moveCard(card, destination, { bottom: this.bottom });
            if(this.shuffle) {
                if(destination === Locations.DynastyDeck) {
                    card.owner.shuffleDynastyDeck();
                } else {
                    card.owner.shuffleConflictDeck();
                }
            }
        });
    }
}

module.exports = ReturnToDeckAction;
