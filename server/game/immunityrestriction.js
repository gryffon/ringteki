const { Stages } = require('./Constants.js');

class ImmunityRestriction {
    constructor(condition) {
        this.condition = condition;
    }

    isMatch(type, abilityContext) {
        return (
            abilityContext &&
            abilityContext.stage !== Stages.Cost &&
            this.condition(abilityContext)
        );
    }
}

module.exports = ImmunityRestriction;
