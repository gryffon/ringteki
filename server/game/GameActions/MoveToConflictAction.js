const CardGameAction = require('./CardGameAction');
const { Locations, CardTypes, EventNames } = require('../Constants');

class MoveToConflictAction extends CardGameAction {
    setup() {
        this.name = 'moveToConflict';
        this.targetType = [CardTypes.Character];
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
        return card.location === Locations.PlayArea;
    }

    getEvent(card, context) {
        return super.createEvent(EventNames.OnMoveToConflict, { card: card, context: context }, () => {
            if(card.controller.isAttackingPlayer()) {
                context.game.currentConflict.addAttacker(card);
            } else {
                context.game.currentConflict.addDefender(card);
            }
        });
    }
}

module.exports = MoveToConflictAction;
