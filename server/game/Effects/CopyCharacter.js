const EffectValue = require('./EffectValue');
const GainAbility = require('./GainAbility');
const { AbilityTypes } = require('../Constants');

class CopyCharacter extends EffectValue {
    constructor(card) {
        super(card);
        this.actions = card.abilities.actions.map(action => new GainAbility(AbilityTypes.Action, action));
        this.reactions = card.abilities.reactions.map(ability => new GainAbility(ability.abilityType, ability));
        this.persistentEffects = card.abilities.persistentEffects;
        this.abilitiesForTargets = {};
    }

    apply(target) {
        this.abilitiesForTargets[target.uuid] = {
            actions: this.actions.map(value => {
                value.apply(target);
                return value.getValue();
            }),
            reactions: this.reactions.map(value => {
                value.apply(target);
                return value.getValue();
            })
        };
    }

    unapply(target) {
        for(const value of this.abilitiesForTargets[target.uuid].reactions) {
            value.unregisterEvents();
        }
        delete this.abilitiesForTargets[target.uuid];
    }

    getActions(target) {
        if(this.abilitiesForTargets[target.uuid]) {
            return this.abilitiesForTargets[target.uuid].actions;
        }
        return [];
    }

    getReactions(target) {
        if(this.abilitiesForTargets[target.uuid]) {
            return this.abilitiesForTargets[target.uuid].reactions;
        }
        return [];
    }

    getPersistentEffects() {
        return this.persistentEffects;
    }
}

module.exports = CopyCharacter;
