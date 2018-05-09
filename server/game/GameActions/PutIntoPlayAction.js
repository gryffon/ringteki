const CardGameAction = require('./CardGameAction');
const EntersPlayEvent = require('../Events/EntersPlayEvent');

class PutIntoPlayAction extends CardGameAction {
    constructor(fate = 0, intoConflict = false) {
        let name = intoConflict ? 'putIntoConflict' : 'putIntoPlay';
        super(name);
        this.intoConflict = intoConflict;
        this.fate = fate;
        this.effect = 'put {0} into play' + intoConflict ? ' in the conflict' : '';
        this.cost = 'putting {0} into play';
    }

    canAffect(card, context = this.context) {
        if(!context || !context.player || card.anotherUniqueInPlay(context.player)) {
            return false;
        } else if(card.location === 'play area' || card.facedown) {
            return false;
        } else if(this.intoConflict) {
            // There is no current conflict, or no context (cards must be put into play by a player, not a framework event)
            if(!context.game.currentConflict || card.type !== 'character') {
                return false;
            }
            // controller is attacking, and character can't attack, or controller is defending, and character can't defend
            if((context.player.isAttackingPlayer() && !card.allowGameAction('participateAsAttacker', context)) || 
                (context.player.isDefendingPlayer() && !card.allowGameAction('participateAsDefender', context))) {
                return false;
            }
            // card cannot participate in this conflict type
            if(card.hasDash(context.game.currentConflict.conflictType)) {
                return false;
            }
            if(!card.checkRestrictions('putIntoPlay', context)) {
                return false;
            }
        } else if(!['character', 'attachment'].includes(card.type)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context = this.context) {
        return new EntersPlayEvent({ intoConflict: this.intoConflict, context: context }, card, this.fate, this);
    }
}

module.exports = PutIntoPlayAction;
