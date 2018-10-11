const Event = require('./Event.js');

class EntersPlayEvent extends Event {
    constructor(params, card, fate, status, gameAction) {
        super('onCharacterEntersPlay', params);
        this.handler = this.entersPlay;
        this.card = card;
        this.fate = fate;
        this.status = status;
        this.gameAction = gameAction;
        this.originalLocation = card.location;
    }

    entersPlay() {
        this.card.new = true;
        if(this.fate) {
            this.card.fate = this.fate;
        }

        this.card.isHonored = this.status === 'honored';
        this.card.isDishonored = this.status === 'dishonored';

        this.context.player.moveCard(this.card, 'play area');

        if(this.intoConflict) {
            if(this.context.player.isAttackingPlayer()) {
                this.context.game.currentConflict.addAttacker(this.card);
            } else {
                this.context.game.currentConflict.addDefender(this.card);
            }
        }
    }
}

module.exports = EntersPlayEvent;
