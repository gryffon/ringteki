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

    canBeTargeted(context, selectedCards = []) {
        if(!this.checkRestrictions('target', context)) {
            return false;
        }
        let targets = selectedCards;
        if(!Array.isArray(targets)) {
            targets = [targets];
        }

        targets = targets.concat(this);
        let targetingCost = context.player.getTargetingCost(context.source, targets);

        if(context.stage === Stages.PreTarget) {
            //We haven't paid the cost yet, so figure out what it will cost to play this so we can know how much fate we'll have available for targeting
            let fateCost = 0;
            if(context.ability.getReducedCost) { //we only want to consider the ability cost, not the card cost
                fateCost = context.ability.getReducedCost(context);
            }
            let alternateFate = context.player.getAvailableAlternateFate(context.playType, context);
            let availableFate = Math.max(context.player.fate - Math.max(fateCost - alternateFate, 0), 0);

            return availableFate >= targetingCost && (targetingCost === 0 || context.player.checkRestrictions('spendFate', context));
        } else if(context.stage === Stages.Target || context.stage === Stages.Effect) {
            //We paid costs first, or targeting has to be done after costs have been paid
            return context.player.fate >= targetingCost && (targetingCost === 0 || context.player.checkRestrictions('spendFate', context));
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
