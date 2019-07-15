const AbilityTargetBase = require('./AbilityTargetBase');
const { SelectRingAction } = require('../GameActions/SelectRingAction')
const { Stages } = require('../Constants.js');

class AbilityTargetRing extends AbilityTargetBase {
    constructor(name, properties, ability) {
        super(name, properties, ability);
        this.targetingAction = new SelectRingAction(this.getTargetingActionPropFactory(properties));
    }

    getTargetingActionPropFactory(properties) {
        const props = {
            targets: true,
            ringCondition: (ring, context) => {
                let contextCopy = context.copy({});
                contextCopy.rings[this.name] = ring;
                if(this.name === 'target') {
                    contextCopy.ring = ring;
                }
                if(context.stage === Stages.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
                    return false;
                }
                return properties.gameAction.hasLegalTarget(contextCopy) && properties.ringCondition(ring, contextCopy) &&
                    (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy));
            }
        };
        return context => {
            const baseProps = super.getTargetingActionPropFactory(properties)(context);
            return Object.assign(props, baseProps);
        }
    }

    getAdditionalProperties(context, targetResults, preTarget = false) {
        let buttons = [];
        if(preTarget) {
            if(!targetResults.noCostsFirstButton) {
                buttons.push({ text: 'Pay costs first', arg: 'costsFirst' });
            }
            buttons.push({ text: 'Cancel', arg: 'cancel' });
        }
        return {
            buttons: buttons,
            cancelHandler: () => {
                targetResults.cancelled = true;
                return true;
            },
            onMenuCommand: (player, arg) => {
                if(arg === 'costsFirst') {
                    targetResults.payCostsFirst = true;
                    return true;
                }
                return true;
            },
            subActionProperties: ring => ({
                handler: () => {
                    context.rings[this.name] = ring;
                    if(this.name === 'target') {
                        context.ring = ring;
                    }
                }
            })
        }
    }

    checkTarget(context) {
        if(!context.rings[this.name] || context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player) {
            return false;
        }
        return this.properties.optional && context.rings[this.name].length === 0 ||
            this.properties.ringCondition(context.rings[this.name], context);
    }
}

module.exports = AbilityTargetRing;
