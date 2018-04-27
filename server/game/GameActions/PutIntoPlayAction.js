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

    canAffect(card) {
        if(card.location === 'play area' || card.facedown || card.anotherUniqueInPlay(this.context) || !['character', 'attachment'].includes(card.type)) {
            return false;
        }
        if(this.intoConflict) {
            // There is no current conflict, or no context (cards must be put into play by a player, not a framework event)
            if(!this.context || !this.context.game.currentConflict || !this.context.player) {
                return false;
            }
            // controller is attacking, and character can't attack, or controller is defending, and character can't defend
            if((this.context.player.isAttackingPlayer() && !card.allowGameAction('participateAsAttacker')) || 
                (this.context.player.isDefendingPlayer() && !card.allowGameAction('participateAsDefender'))) {
                return false;
            }
            // card cannot participate in this conflict type
            if(card.hasDash(this.context.game.currentConflict.conflictType)) {
                return false;
            }
            if(!card.allowGameAction('putIntoPlay', this.context)) {
                return false;
            }
        }
        return super.canAffect(card);
    }

    getEvent(card, fate = this.fate) {
        return new EntersPlayEvent({ intoConflict: this.intoConflict, context: this.context }, card, fate, this);
    }
}

module.exports = PutIntoPlayAction;
