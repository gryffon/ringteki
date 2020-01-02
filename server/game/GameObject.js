const uuid = require('uuid');
const _ = require('underscore');
const GameActions = require('./GameActions/GameActions');
const ReduceableFateCost = require('./costs/ReduceableFateCost');
const { EffectNames, Stages, CardTypes } = require('./Constants');

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
            let targets = [];
            if (context.preTargets) {
                targets = context.preTargets;
                if (!Array.isArray(targets)) {
                    targets = [targets];
                }
            }

            let contextCopy = context.copy();
            contextCopy.preTargets = targets.concat(this);
            let costs = context.ability.getCosts(contextCopy);
            let fateCost = costs.find(cost => cost.getReducedCost);

            if (fateCost) {
                return fateCost.canPay(contextCopy);
            }

            //We have a triggered ability that's not getting played, so we need to ignore the play cost of whatever is triggering the ability
            let minCost = contextCopy.player.getMinimumCost(contextCopy.playType, contextCopy, contextCopy.preTargets, true);
            minCost = minCost - contextCopy.source.getCost();
            return context.player.fate >= minCost && (minCost === 0 || context.player.checkRestrictions('spendFate', context));
        }
        else if (context.stage === Stages.Target && context.preTargets.length === 0) {
            //We paid costs first
            //We've already paid the play cost
            let targets = [];
            if (context.targets) {
                targets = context.targets;
                if (!Array.isArray(targets)) {
                    targets = [targets];
                }
            }

            let contextCopy = context.copy();
            contextCopy.preTargets = targets.concat(this);
            let minCost = contextCopy.player.getMinimumCost(contextCopy.playType, contextCopy, contextCopy.preTargets, true);
            minCost = minCost - contextCopy.source.getCost();
            return context.player.fate >= minCost && (minCost === 0 || context.player.checkRestrictions('spendFate', context));
        }

        return true;
    }

    getShortSummaryForControls(activePlayer) {
        return this.getShortSummary(activePlayer);
    }

    isParticipating() {
        return this.game.currentConflict && this.game.currentConflict.isParticipating(this);
    }

}

module.exports = GameObject;
