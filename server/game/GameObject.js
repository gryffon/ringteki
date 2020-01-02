const uuid = require('uuid');
const _ = require('underscore');
const GameActions = require('./GameActions/GameActions');
const { EffectNames } = require('./Constants');

class GameObject {
    constructor(game, name) {
        this.game = game;
        this.name = name;
        this.id = name;
        this.printedType = '';
        this.facedown = false;
        this.uuid = uuid.v1();
        this.effects = [];
    }

    get type() {
        return this.getType();
    }

    addEffect(effect) {
        this.effects.push(effect);
    }

    removeEffect(effect) {
        this.effects = this.effects.filter(e => e !== effect);
    }

    getEffects(type) {
        let filteredEffects = this.getRawEffects().filter(effect => effect.type === type);
        return filteredEffects.map(effect => effect.getValue(this));
    }

    getRawEffects() {
        const suppressEffects = this.effects.filter(effect => effect.type === EffectNames.SuppressEffects);
        const suppressedEffects = suppressEffects.reduce((array, effect) => array.concat(effect.getValue(this)), []);
        return this.effects.filter(effect => !suppressedEffects.includes(effect));
    }

    sumEffects(type) {
        let filteredEffects = this.getEffects(type);
        return filteredEffects.reduce((total, effect) => total + effect, 0);
    }

    anyEffect(type) {
        return this.getEffects(type).length > 0;
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
        return !this.getEffects(EffectNames.AbilityRestrictions).some(restriction => restriction.isMatch(actionType, context, this));
    }

    isUnique() {
        return false;
    }

    getType() {
        if(this.anyEffect(EffectNames.ChangeType)) {
            return this.mostRecentEffect(EffectNames.ChangeType);
        }
        return this.printedType;
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

    canBeTargeted(context) {
        if (!this.checkRestrictions('target', context)) {
            return false;
        }

        let targets = [];
        if (context.TEST_SELECTED_CARDS) {
            targets = context.TEST_SELECTED_CARDS;
            if (!Array.isArray(targets)) {
                targets = [targets];
            }
        }

        let contextCopy = context.copy();
        contextCopy.TEST_SELECTED_CARDS = targets.concat(this);
        return context.ability.canPayFateCost(contextCopy);
    }

    getShortSummaryForControls(activePlayer) {
        return this.getShortSummary(activePlayer);
    }

    isParticipating() {
        return this.game.currentConflict && this.game.currentConflict.isParticipating(this);
    }

}

module.exports = GameObject;
