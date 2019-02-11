const AbilityLimit = require('../abilitylimit');
const EffectValue = require('./EffectValue');
const { AbilityTypes } = require('../Constants');

class GainAbility extends EffectValue {
    constructor(abilityType, ability) {
        super();
        this.abilityType = abilityType;
        this.properties = ability;
        this.grantedAbilityLimits = {};
        if(ability.properties) {
            let newProps = { printedAbility: false, abilityIdentifier: ability.abilityIdentifier };
            if(ability.properties.limit) {
                // If the copied ability has a limit, we need to create a new instantiation of it, with the same max and reset event
                newProps.limit = AbilityLimit.repeatable(ability.properties.limit.max, ability.properties.limit.eventName);
            }
            if(ability.properties.max) {
                // Same for max
                newProps.max = AbilityLimit.repeatable(ability.properties.max.max, ability.properties.max.eventName);
            }
            this.properties = Object.assign({}, ability.properties, newProps);
        }
    }

    reset() {
        this.grantedAbilityLimits = {};
    }

    apply(target) {
        if(this.abilityType === AbilityTypes.Persistent) {
            this.value = this.properties;
            this.value.ref = target.addEffectToEngine(this.value);
            return;
        } else if(this.abilityType === AbilityTypes.Action) {
            this.value = target.createAction(this.properties);
        } else {
            this.value = target.createTriggeredAbility(this.abilityType, this.properties);
            this.value.registerEvents();
        }
        if(!this.grantedAbilityLimits[target.uuid]) {
            this.grantedAbilityLimits[target.uuid] = this.value.limit;
        } else {
            this.value.limit = this.grantedAbilityLimits[target.uuid];
        }
    }

    unapply(target) {
        if([AbilityTypes.ForcedInterrupt, AbilityTypes.ForcedReaction, AbilityTypes.Interrupt, AbilityTypes.Reaction, AbilityTypes.WouldInterrupt].includes(this.abilityType)) {
            this.value.unregisterEvents();
        } else if(this.abilityType == AbilityTypes.Persistent && this.value.ref) {
            target.removeEffectFromEngine(this.value.ref);
            delete this.value.ref;
        }
    }
}

module.exports = GainAbility;
