const CardGameAction = require('./CardGameAction');

class DiscardFromHandAction extends CardGameAction {
    setup() {
        this.name = 'discardFromHand';
        this.targetType = ['character', 'attachment', 'event'];
        this.effectMsg = 'discard {0}';
        this.cost = 'discarding {0}';
    }

    canAffect(card, context) {
        if(card.location !== 'hand') {
            return false;
        }
        return super.canAffect(card, context);
    }

    checkEventCondition() {
        return true;
    }

    getEventArray(context) {
        if(this.targets.length === 0) {
            return [];
        }
        return [this.createEvent('onCardsDiscardedFromHand', { player: this.targets[0].controller, cards: this.targets, context: context }, event => {
            for(const card of event.cards) {
                card.controller.moveCard(card, card.isDynasty ? 'dynasty discard pile' : 'conflict discard pile');
            }
        })];
    }

    getEvent(card, context) {
        let handler = () => card.controller.moveCard(card, card.isDynasty ? 'dynasty discard pile' : 'conflict discard pile');
        return super.createEvent('onCardsDiscardedFromHand', { player: card.controller, cards: [card], context: context }, handler);
    }
}

module.exports = DiscardFromHandAction;
