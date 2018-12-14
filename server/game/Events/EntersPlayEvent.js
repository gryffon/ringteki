const Event = require('./Event.js');
const { Locations, EventNames } = require('../Constants');

class EntersPlayEvent extends Event {
    constructor(params, card, fate, status, gameAction) {
        super(EventNames.OnCharacterEntersPlay, params);
        this.handler = this.entersPlay;
        this.card = card;
        this.fate = fate;
        this.status = status;
        this.gameAction = gameAction;
        this.originalLocation = card.location;
    }

    entersPlay() {
        if(this.card.location.includes('province')) {
            this.context.refillProvince(this.card.controller, this.card.location);
        }

        this.card.new = true;
        if(this.fate) {
            this.card.fate = this.fate;
        }

        if(this.status === 'honored') {
            this.card.honor();
        } else if(this.status === 'dishonored') {
            this.card.dishonor();
        }

        this.context.player.moveCard(this.card, Locations.PlayArea);

        //@ts-ignore
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
