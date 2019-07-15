const AbilityTargetCard = require('./AbilityTargetCard');
const { Stages } = require('../Constants.js');

class AbilityTargetAbility extends AbilityTargetCard {
    getCardCondition(properties, cardCondition) {
        return (card, context) => {
            const token = card.personalHonor;
            if(!token) {
                return false;
            }
            const contextCopy = context.copy();
            contextCopy.tokens[this.name] = token;
            if(this.name === 'target') {
                contextCopy.token = token;
            }
            if(context.stage === Stages.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
                return false;
            }
            return (cardCondition || cardCondition(card, contextCopy)) &&
                (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy)) &&
                properties.gameAction.hasLegalTarget(contextCopy);
        };
    }

    getAdditionalProperties(context, targetResults, preTarget = false) {
        let props = super.getAdditionalProperties(context, targetResults, preTarget);
        return Object.assign(props, {
            targets: !!this.properties.targets,
            subActionProperties: card => ({
                handler: () => {
                    context.tokens[this.name] = card.personalHonor;
                    if(this.name === 'target') {
                        context.token = card.personalHonor;
                    }
                }
            })
        });
    }

    checkTarget(context) {
        if(!context.tokens[this.name] || context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player) {
            return false;
        }
        return this.targetingAction.canAffect(context.tokens[this.name].card, context);
    }
}

module.exports = AbilityTargetAbility;
