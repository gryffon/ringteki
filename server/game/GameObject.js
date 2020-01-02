const uuid = require('uuid');
const _ = require('underscore');
const GameActions = require('./GameActions/GameActions');
const { EffectNames, Stages } = require('./Constants');

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

        if (context.stage === Stages.PreTarget) {
            let targets = this.getSelectedCards(context);

            let contextCopy = context.copy();

            targets = targets.concat(this);

            let minCost = contextCopy.player.getTargetingCost(context.source, targets);
            let fateCost = 0;
            if (context.ability.getReducedCost) {
                fateCost = context.ability.getReducedCost(contextCopy);
            }
            let availableFate = Math.max(context.player.fate - fateCost, 0);
            
            return availableFate >= minCost && (minCost === 0 || context.player.checkRestrictions('spendFate', context));
        }
        else if (context.stage === Stages.Target || context.stage === Stages.Effect) {
            //We paid costs first, or targeting has to be done after costs have been paid
            let targets = this.getSelectedCards(context);

            let contextCopy = context.copy();
            targets = targets.concat(this);
            let minCost = contextCopy.player.getTargetingCost(context.source, targets);
            return context.player.fate >= minCost && (minCost === 0 || context.player.checkRestrictions('spendFate', context));
        }

        return true;
    }

    getSelectedCards(context) {
        let targets = [];
        if (context.player.getSelectedCards()) {
            let selfTargets = context.player.getSelectedCards();
            if (!Array.isArray(selfTargets)) {
                selfTargets = [selfTargets];
            }
            targets = targets.concat(selfTargets);
        }

        if (context.player.opponent.getSelectedCards()) {
            let opponentTargets = context.player.opponent.getSelectedCards();
            if (!Array.isArray(opponentTargets)) {
                opponentTargets = [opponentTargets];
            }
            targets = targets.concat(opponentTargets);
        }
        return targets;
    }

    getShortSummaryForControls(activePlayer) {
        return this.getShortSummary(activePlayer);
    }

    isParticipating() {
        return this.game.currentConflict && this.game.currentConflict.isParticipating(this);
    }

}

module.exports = GameObject;
