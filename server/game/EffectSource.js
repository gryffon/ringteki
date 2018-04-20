const AbilityDsl = require('./abilitydsl.js');
const GameObject = require('./GameObject');

// This class is inherited by Ring and BaseCard and also represents Framework effects

class EffectSource extends GameObject {
    constructor(game, name = 'Framework effect') {
        super(game, name);
    }

    /**
     * Applies an immediate effect which lasts until the end of the current
     * duel.
     */
    untilEndOfDuel(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, Object.assign({ duration: 'untilEndOfDuel', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the current
     * conflict.
     */
    untilEndOfConflict(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, Object.assign({ duration: 'untilEndOfConflict', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the phase.
     */
    untilEndOfPhase(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, Object.assign({ duration: 'untilEndOfPhase', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the round.
     */
    untilEndOfRound(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, Object.assign({ duration: 'untilEndOfRound', location: 'any' }, properties));
    }

    /**
     * Applies a lasting effect which lasts until an event contained in the
     * `until` property for the effect has occurred.
     */
    lastingEffect(propertyFactory) {
        let properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, Object.assign({ duration: 'custom', location: 'any' }, properties));
    }

    /**
     * Applies a delayed effect
     */
    delayedEffect(properties) {
        return this.game.addDelayedEffect(this, properties);
    }

    /**
     * Applies a terminal condition
     */
    terminalCondition(properties) {
        return this.game.addTerminalCondition(this, properties);
    }
}

module.exports = EffectSource;
