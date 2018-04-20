const _ = require('underscore');

const AbilityDsl = require('./abilitydsl.js');
const DelayedEffect = require('./DelayedEffect.js');
const GameObject = require('./GameObject');
const TerminalCondition = require('./TerminalCondition.js');

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
        this.addEffectToEngine(Object.assign({ duration: 'untilEndOfDuel', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the current
     * conflict.
     */
    untilEndOfConflict(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.addEffectToEngine(Object.assign({ duration: 'untilEndOfConflict', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the phase.
     */
    untilEndOfPhase(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.addEffectToEngine(Object.assign({ duration: 'untilEndOfPhase', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the round.
     */
    untilEndOfRound(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.addEffectToEngine(Object.assign({ duration: 'untilEndOfRound', location: 'any' }, properties));
    }

    /**
     * Applies a lasting effect which lasts until an event contained in the
     * `until` property for the effect has occurred.
     */
    lastingEffect(propertyFactory) {
        let properties = propertyFactory(AbilityDsl);
        this.addEffectToEngine(Object.assign({ duration: 'custom', location: 'any' }, properties));
    }

    /**
     * Applies a delayed effect
     */
    delayedEffect(properties) {
        let effect = new DelayedEffect(this.game, this, properties);
        this.game.effectEngine.addDelayedEffect(effect);
        return effect;
    }

    /**
     * Applies a terminal condition
     */
    terminalCondition(properties) {
        let effect = new TerminalCondition(this.game, this, properties);
        this.game.effectEngine.addTerminalCondition(effect);
        return effect;
    }

    /* 
     * Adds a persistent/lasting/delayed effect to the effect engine
     * @param {Object} properties - properties for the effect - see Effects/Effect.js
     */
    addEffectToEngine(properties) {
        let effectFactory = properties.effect;
        properties = _.omit(properties, 'effect');
        if(Array.isArray(effectFactory)) {
            for(const factory of effectFactory) {
                this.game.effectEngine.add(factory(this.game, this, properties));
            }    
        } else {
            this.game.effectEngine.add(effectFactory(this.game, this, properties));
        }
    }
}

module.exports = EffectSource;
