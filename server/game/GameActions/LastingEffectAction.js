const GameAction = require('./GameAction');
const { Durations } = require('../Constants');

class LastingEffectAction extends GameAction {
    setDefaultProperties() {
        this.duration = Durations.UntilEndOfConflict;
        this.condition = null;
        this.until = null;
        this.effect = [];
        this.targetController = null;
    }

    setup() {
        super.setup();
        this.name = 'applyLastingEffect';
        this.effectMsg = 'apply a lasting effect';
    }

    hasLegalTarget(context) {
        this.update(context);
        return this.effect.length > 0;
    }

    getEventArray(context) {
        let properties = {
            condition: this.condition,
            effect: this.effect,
            targetController: this.targetController,
            until: this.until
        };
        return [super.createEvent('applyLastingEffect', { context: context }, event => event.context.source[this.duration](() => properties))];
    }
}

module.exports = LastingEffectAction;
