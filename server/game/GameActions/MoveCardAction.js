const CardGameAction = require('./CardGameAction');
const { Locations } = require('../Constants');

class MoveCardAction extends CardGameAction {
    setDefaultProperties() {
        this.destination = '';
        this.switch = false;
        this.shuffle = false;
        this.faceup = false;
    }

    setup() {
        this.name = 'move';
        this.targetType = ['character', 'attachment', 'event', 'holding'];
        this.effectMsg = 'move {0}';
    }

    canAffect(card, context) {
        if(card.location === Locations.PlayArea || !card.controller.getSourceList(this.destination)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onMoveCard', { card: card, context: context }, event => {
            if(this.switch) {
                let otherCard = card.controller.getDynastyCardInProvince(this.destination);
                context.player.moveCard(otherCard, card.location);
            } else if(['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location)) {
                event.context.refillProvince(context.player, card.location);
            }
            context.player.moveCard(card, this.destination);
            if(this.shuffle) {
                if(this.destination === Locations.ConflictDeck) {
                    context.player.shuffleConflictDeck();
                } else if(this.destination === Locations.DynastyDeck) {
                    context.player.shuffleDynastyDeck();
                }
            } else if(this.faceup) {
                card.facedown = false;
            }
        });
    }
}

module.exports = MoveCardAction;
