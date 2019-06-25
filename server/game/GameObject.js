const uuid = require('uuid');
const _ = require('underscore');
const GameActions = require('./GameActions/GameActions');
const { EffectNames } = require('./Constants');

class GameObject {
    constructor(game, name) {
        this.game = game;
        this.name = name;
        this.id = name;
        this.type = '';
        this.facedown = false;
        this.uuid = uuid.v1();
        this.effects = [];
    }

    addEffect(effect) {
        this.effects.push(effect);
    }

    removeEffect(effect) {
        this.effects = this.effects.filter(e => e !== effect);
    }

    getEffects(type) {
        let suppressedEffects = this.getSuppressedEffects();
        if(type) {
            let filteredEffects = this.effects.filter(effect => effect.type === type && !suppressedEffects.includes(effect));
            return filteredEffects.map(effect => effect.getValue(this));
        }
        return this.effects.filter(effect => !suppressedEffects.includes(effect));
    }

    getSuppressedEffects() {
        let suppressingEffects = this.effects.filter(effect => effect.type === EffectNames.SuppressEffects);
        let suppressedEffects = this.effects.filter(effect => suppressingEffects.some(suppressingEffect => suppressingEffect.value.value(effect)));
        return suppressedEffects;
    }

    sumEffects(type) {
        let filteredEffects = this.effects.filter(effect => effect.type === type);
        return filteredEffects.reduce((total, effect) => total + effect.getValue(this), 0);
    }

    anyEffect(type) {
        return this.effects.filter(effect => effect.type === type).length > 0;
    }

    mostRecentEffect(type) {
        return _.last(this.getEffects(type));
    }

    allowGameAction(actionType, context = this.game.getFrameworkContext()) {
        if(GameActions[actionType]) {
            return GameActions[actionType]().canAffect(this, context);
        }
        return this.checkRestrictions(actionType, context);
    }


    checkRestrictions(actionType, context) {
        return !this.getEffects(EffectNames.AbilityRestrictions).some(restriction => restriction.isMatch(actionType, context));
    }

    isUnique() {
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

    getShortSummary(activePlayer) { // eslint-disable-line no-unused-vars
        return {
            id: this.id,
            label: this.name,
            name: this.name,
            facedown: this.facedown,
            type: this.getType()
        };
    }

}

module.exports = GameObject;
