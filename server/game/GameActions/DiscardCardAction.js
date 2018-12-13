const CardGameAction = require('./CardGameAction');
const { Locations, EventNames } = require('../Constants');

class DiscardCardAction extends CardGameAction {
    setup() {
        super.setup();
        this.name = 'discardCard';
        this.effectMsg = 'discard {0}';
        this.cost = 'discarding {0}';
    }

    checkEventCondition() {
        return true;
    }

    fullyResolved(event) {
        return this.target.length === 0 || this.target.every(card => event.cards.includes(card));
    }

    getEventArray(context) {
        if(this.target.length === 0) {
            return [];
        }
        return [this.createEvent(EventNames.OnCardsDiscarded, { player: this.target[0].controller, cards: this.target, context: context }, event => {
            for(const card of event.cards) {
                if(card.location.includes('province')) {
                    event.context.refillProvince(card.controller, card.location);
                }
                card.controller.moveCard(card, card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
            }
        })];
    }

    getEvent(card, context) {
        return super.createEvent(EventNames.OnCardsDiscarded, { player: card.controller, cards: [card], context: context }, event => {
            if(card.location.includes('province')) {
                event.context.refillProvince(card.controller, card.location);
            }
            card.controller.moveCard(card, card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
        });
    }
}

module.exports = DiscardCardAction;
