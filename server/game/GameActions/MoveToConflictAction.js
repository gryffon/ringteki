const CardGameAction = require('./CardGameAction');

class MoveToConflictAction extends CardGameAction {
    setup() {
        this.name = 'moveToConflict';
        this.targetType = ['character'];
        this.effectMsg = 'move {0} into the conflict';
    }

    canAffect(card, context) {
        if(!super.canAffect(card, context)) {
            return false;
        }
        if(!context.game.currentConflict || card.isParticipating()) {
            return false;
        }
        if(card.controller.isAttackingPlayer()) {
            if(!card.canParticipateAsAttacker()) {
                return false;
            }
        } else if(!card.canParticipateAsDefender()) {
            return false;
        }
        return true;
    }
    /*
    getEventArray(context) {
        if(this.targets.length === 0) {
            return [];
        }
        let events = this.targets.map(card => this.getEvent(card, context));
        return events.concat(this.createEvent('onMoveCharactersToConflict', { moveToConflictEvents: events }));
    }
    */

    getEvent(card, context) {
        return super.createEvent('onMoveToConflict', { card: card, context: context }, () => {
            if(card.controller.isAttackingPlayer()) {
                context.game.currentConflict.addAttacker(card);
            } else {
                context.game.currentConflict.addDefender(card);
            }
        });
    }
}

module.exports = MoveToConflictAction;
