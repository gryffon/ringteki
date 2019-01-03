const _ = require('underscore');
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
    setDash: (card, type) => card.hasDash(type),
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
    constructor(type = '', value = true) {
        this.type = type;
        this.value = value;
        this.context = null;
        this.duration = null;
    }

    apply(target) {
        target.addEffect(this);
    }

    unapply(target) {
        target.removeEffect(this);
    }

    getValue() {
        return this.value;
    }

    recalculate() {
        return false;
    }

    setContext(context) {
        this.context = context;
        if(typeof this.value === 'object') {
            // @ts-ignore
            this.value.context = context;
        }
    }

    canBeApplied(target) {
        if(hasDash[this.type] && hasDash[this.type](target, this.value)) {
            return false;
        }
        return this.checkConflictingEffects(this.type, target);
    }

    checkConflictingEffects(type, target) {
        if(binaryCardEffects.includes(type)) {
            let matchingEffects = target.effects.filter(effect => effect.type === type);
            return matchingEffects.every(effect => this.hasLongerDuration(effect) || effect.isConditional);
        }
        if(conflictingEffects[type]) {
            let matchingEffects = conflictingEffects[type](target, this.value);
            return matchingEffects.every(effect => this.hasLongerDuration(effect) || effect.isConditional);
        }
        if(type === EffectNames.ModifyBothSkills) {
            return this.checkConflictingEffects(EffectNames.ModifyMilitarySkill, target) || this.checkConflictingEffects(EffectNames.ModifyPoliticalSkill, target);
        }
        if(type === EffectNames.AddGloryToBothSkills) {
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
