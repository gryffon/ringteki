const _ = require('underscore');
const EffectValue = require('./EffectValue');
const { EffectNames, Durations } = require('../Constants');

const binaryCardEffects = [
    EffectNames.Blank,
    EffectNames.CanBeSeenWhenFacedown,
    EffectNames.CannotParticipateAsAttacker,
    EffectNames.CannotParticipateAsDefender,
    EffectNames.AbilityRestrictions,
    EffectNames.DoesNotBow,
    EffectNames.DoesNotReady,
    EffectNames.ShowTopConflictCard
];

const MilitaryModifiers = [
    EffectNames.ModifyBaseMilitarySkill,
    EffectNames.ModifyMilitarySkill,
    EffectNames.ModifyMilitarySkillMultiplier,
    EffectNames.ModifyBothSkills
];

const PoliticalModifiers = [
    EffectNames.ModifyBasePoliticalSkill,
    EffectNames.ModifyPoliticalSkill,
    EffectNames.ModifyPoliticalSkillMultiplier,
    EffectNames.ModifyBothSkills
];

const hasDash = {
    modifyBaseMilitarySkill: card => card.hasDash('military'),
    modifyBasePoliticalSkill: card => card.hasDash('political'),
    modifyBothSkills: card => card.hasDash('military') && card.hasDash('political'),
    modifyMilitarySkill: card => card.hasDash('military'),
    modifyMilitarySkillMultiplier: card => card.hasDash('military'),
    modifyPoliticalSkill: card => card.hasDash('political'),
    modifyPoliticalSkillMultiplier: card => card.hasDash('political'),
    setBaseMilitarySkill: card => card.hasDash('military'),
    setBasePoliticalSkill: card => card.hasDash('political'),
    setDash: (card, type) => type && card.hasDash(type),
    setMilitarySkill: card => card.hasDash('military'),
    setPoliticalSkill: card => card.hasDash('political')
};

const conflictingEffects = {
    modifyBaseMilitarySkill: card => card.effects.filter(effect => effect.type === EffectNames.SetBaseMilitarySkill),
    modifyBasePoliticalSkill: card => card.effects.filter(effect => effect.type === EffectNames.SetBasePoliticalSkill),
    modifyGlory: card => card.effects.filter(effect => effect.type === EffectNames.SetGlory),
    modifyMilitarySkill: card => card.effects.filter(effect => effect.type === EffectNames.SetMilitarySkill),
    modifyMilitarySkillMultiplier: card => card.effects.filter(effect => effect.type === EffectNames.SetMilitarySkill),
    modifyPoliticalSkill: card => card.effects.filter(effect => effect.type === EffectNames.SetPoliticalSkill),
    modifyPoliticalSkillMultiplier: card => card.effects.filter(effect => effect.type === EffectNames.SetPoliticalSkill),
    setBaseMilitarySkill: card => card.effects.filter(effect => effect.type === EffectNames.SetMilitarySkill),
    setBasePoliticalSkill: card => card.effects.filter(effect => effect.type === EffectNames.SetPoliticalSkill),
    setMaxConflicts: (player, value) =>
        player.mostRecentEffect(EffectNames.SetMaxConflicts) === value ? [_.last(player.effects.filter(effect => effect.type === EffectNames.SetMaxConflicts))] : [],
    takeControl: (card, player) =>
        card.mostRecentEffect(EffectNames.TakeControl) === player ? [_.last(card.effects.filter(effect => effect.type === EffectNames.TakeControl))] : []
};

class StaticEffect {
    constructor(type, value) {
        this.type = type;
        if(value instanceof EffectValue) {
            this.value = value;
        } else {
            this.value = new EffectValue(value);
        }
        this.value.reset();
        this.context = null;
        this.duration = null;
    }

    apply(target) {
        target.addEffect(this);
        this.value.apply(target);
    }

    unapply(target) {
        target.removeEffect(this);
        this.value.unapply(target);
    }

    getValue() {
        return this.value.getValue();
    }

    recalculate() {
        return false;
    }

    setContext(context) {
        this.context = context;
        this.value.setContext(context);
    }

    canBeApplied(target) {
        return !hasDash[this.type] || !hasDash[this.type](target, this.value);
    }

    isMilitaryModifier() {
        return MilitaryModifiers.includes(this.type);
    }

    isPoliticalModifier() {
        return PoliticalModifiers.includes(this.type);
    }

    isModifier() {
        return this.isMilitaryModifier() || this.isPoliticalModifier();
    }

    checkConflictingEffects(type, target) {
        if(binaryCardEffects.includes(type)) {
            let matchingEffects = target.effects.filter(effect => effect.type === type);
            return matchingEffects.every(effect => this.hasLongerDuration(effect) || effect.isConditional);
        }
        if(conflictingEffects[type]) {
            let matchingEffects = conflictingEffects[type](target, this.getValue());
            return matchingEffects.every(effect => this.hasLongerDuration(effect) || effect.isConditional);
        }
        if(type === EffectNames.ModifyBothSkills) {
            return this.checkConflictingEffects(EffectNames.ModifyMilitarySkill, target) || this.checkConflictingEffects(EffectNames.ModifyPoliticalSkill, target);
        }
        if(type === EffectNames.AddGloryToBothSkills) {
            return this.checkConflictingEffects(EffectNames.ModifyMilitarySkill, target) || this.checkConflictingEffects(EffectNames.ModifyPoliticalSkill, target);
        }
        if(type === EffectNames.HonorStatusDoesNotModifySkill) {
            return this.checkConflictingEffects(EffectNames.ModifyMilitarySkill, target) || this.checkConflictingEffects(EffectNames.ModifyPoliticalSkill, target);
        }
        if(type === EffectNames.HonorStatusReverseModifySkill) {
            return this.checkConflictingEffects(EffectNames.ModifyMilitarySkill, target) || this.checkConflictingEffects(EffectNames.ModifyPoliticalSkill, target);
        }
        return true;
    }

    hasLongerDuration(effect) {
        let durations = [
            Durations.UntilEndOfDuel,
            Durations.UntilEndOfConflict,
            Durations.UntilEndOfPhase,
            Durations.UntilEndOfRound
        ];
        return durations.indexOf(this.duration) > durations.indexOf(effect.duration);
    }

    getDebugInfo() {
        return {
            type: this.type,
            value: this.value
        };
    }
}

module.exports = StaticEffect;
