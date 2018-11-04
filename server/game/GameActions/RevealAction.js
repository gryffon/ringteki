const CardGameAction = require('./CardGameAction');
const { Locations } = require('../Constants');

class RevealAction extends CardGameAction {
    setDefaultProperties() {
        this.chatMessage = false;
        this.player = null;
    }

    setup() {
        super.setup();
        this.name = 'reveal';
        this.effectMsg = 'reveal a card';
        this.cost = 'revealing {0}';
    }

    canAffect(card, context) {
        let testLocations = ['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province', Locations.PlayArea];
        if(!card.facedown && testLocations.includes(card.location)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let eventName = 'onCardRevealed';
        if(card.type === 'province') {
            eventName = 'onProvinceRevealed';
        }
        return super.createEvent(eventName, { card, context }, event => {
            if(this.chatMessage) {
                context.game.addMessage('{0} reveals {1} due to {2}', this.player || context.player, card, context.source);
            }
            event.card.facedown = false;
        });
    }
}

module.exports = RevealAction;
