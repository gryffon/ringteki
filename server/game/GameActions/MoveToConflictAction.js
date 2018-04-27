const CardGameAction = require('./CardGameAction');

class MoveToConflictAction extends CardGameAction {
    constructor() {
        super('moveToConflict');
        this.effect = 'move {0} into the conflict',
        this.cost = '';
    }

    canAffect(card) {
        if(!this.context.game.currentConflict || card.isParticipating() || card.type !== 'character') {
            return false;
        }
        if(card.controller.isAttackingPlayer()) {
            if(!card.canParticipateAsAttacker()) {
                return false;
            }
        } else if(!card.canParticipateAsDefender()) {
            return false;
        }
        return super.canAffect(card);
    }

    getEventArray() {
        if(this.cards.length === 0) {
            return [];
        }
        let events = this.cards.map(card => this.getEvent(card));
        return events.concat(this.createEvent('onMoveCharactersToConflict', { moveToConflictEvents: events }));
    }

    getEvent(card) {
        return super.createEvent('onCardHonored', { card: card, context: this.context }, () => card.honor());
    }
}

module.exports = MoveToConflictAction;
