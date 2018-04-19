const _ = require('underscore');

const AbilityDsl = require('./abilitydsl.js');
const GameObject = require('./GameObject');

// This class is inherited by Ring and BaseCard and also represents Framework effects

class EffectSource extends GameObject {
    constructor(game, name = 'Framework effect') {
        super(game, name);
    }

    isUnique() {
        return false;
    }

    isBlank() {
        return false;
    }

    getType() {
        return this.type;
    }

    getPrintedFaction() {
        return null;
    }

    hasKeyword() {
        return false;
    }

    hasTrait() {
        return false;
    }

    getTraits() {
        return [];
    }
            
    isFaction() {
        return false;
    }
            
    hasToken() {
        return false;
    }
            
    /**
     * Applies an immediate effect which lasts until the end of the current
     * duel.
     */
    untilEndOfDuel(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'untilEndOfDuel', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the current
     * conflict.
     */
    untilEndOfConflict(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'untilEndOfConflict', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which expires at the end of the current 
     * conflict. Per game rules this duration is outside of the phase.
     */
    atEndOfConflict(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'atEndOfConflict', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the phase.
     */
    untilEndOfPhase(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'untilEndOfPhase', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which expires at the end of the phase. Per
     * game rules this duration is outside of the phase.
     */
    atEndOfPhase(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'atEndOfPhase', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the round.
     */
    untilEndOfRound(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'untilEndOfRound', location: 'any' }, properties));
    }

    /**
     * Applies a lasting effect which lasts until an event contained in the
     * `until` property for the effect has occurred.
     */
    lastingEffect(propertyFactory) {
        let properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'custom', location: 'any' }, properties));
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

    getShortSummary() {
        return {
            id: this.id,
            label: this.name,
            name: this.name,
            facedown: this.facedown,
            type: this.getType()
        };
    }

}

module.exports = EffectSource;
