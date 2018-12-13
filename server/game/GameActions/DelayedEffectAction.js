const CardGameAction = require('./CardGameAction');
const { Locations, EventNames } = require('../Constants');

class DelayedEffectAction extends CardGameAction {
    setDefaultProperties() {
        this.when = {};
        this.message = '';
        this.gameAction = [];
        this.handler = null;
    }

    setup() {
        super.setup();
        this.name = 'applyDelayedEffect';
        this.effectMsg = 'apply a delayed effect to {0}';
    }

    canAffect(card, context) {
        if(card.location !== Locations.PlayArea) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let properties = {
            when: this.when,
            message: this.message,
            gameAction: this.gameAction,
            handler: this.handler,
            target: card,
            context: context
        };
        return super.createEvent(EventNames.OnEffectApplied, { card: card, context: context }, event => event.context.source.delayedEffect(() => properties));
    }
}

module.exports = DelayedEffectAction;
