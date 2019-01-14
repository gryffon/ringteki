const EffectValue = require('./EffectValue');
const GainAbility = require('./GainAbility');
const { AbilityTypes, Locations } = require('../Constants');

class CopyCharacter extends EffectValue {
    constructor(card) {
        super(card);
        this.actions = card.abilities.actions.map(action => new GainAbility(AbilityTypes.Action, action));
        this.reactions = card.abilities.reactions.map(ability => new GainAbility(ability.abilityType, ability));
        this.persistentEffects = card.abilities.persistentEffects.map(effect => Object.assign({}, effect));
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
        for(const effect of this.persistentEffects) {
            if(effect.location === Locations.PlayArea || effect.location === Locations.Any) {
                effect.ref = target.addEffectToEngine(effect);
            }
        }
    }

    unapply(target) {
        for(const value of this.abilitiesForTargets[target.uuid].reactions) {
            value.unregisterEvents();
        }
        for(const effect of this.persistentEffects) {
            if(effect.ref) {
                target.removeEffectFromEngine(effect.ref);
                effect.ref = [];
            }
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
