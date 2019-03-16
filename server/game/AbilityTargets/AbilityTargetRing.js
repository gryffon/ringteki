const _ = require('underscore');

const { Stages, Players } = require('../Constants.js');

class AbilityTargetRing {
    constructor(name, properties, ability) {
        this.name = name;
        this.properties = properties;
        this.ringCondition = (ring, context) => {
            let contextCopy = context.copy();
            contextCopy.rings[this.name] = ring;
            if(this.name === 'target') {
                contextCopy.ring = ring;
            }
            if(context.stage === Stages.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
                return false;
            }
            return (properties.gameAction.length === 0 || properties.gameAction.some(gameAction => gameAction.hasLegalTarget(contextCopy))) &&
                   properties.ringCondition(ring, contextCopy) && (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy));
        };
        for(let gameAction of this.properties.gameAction) {
            gameAction.getDefaultTargets = context => context.rings[name];
        }
        this.dependentTarget = null;
        this.dependentCost = null;
        if(this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find(target => target.name === this.properties.dependsOn);
            dependsOnTarget.dependentTarget = this;
        }
    }

    canResolve(context) {
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    hasLegalTarget(context) {
        return _.any(context.game.rings, ring => this.ringCondition(ring, context));
    }

    getGameAction(context) {
        return this.properties.gameAction.filter(gameAction => gameAction.hasLegalTarget(context));
    }

    getAllLegalTargets(context) {
        return _.filter(context.game.rings, ring => this.ringCondition(ring, context));
    }

    resolve(context, targetResults) {
        if(targetResults.cancelled || targetResults.payCostsFirst || targetResults.delayTargeting) {
            return;
        }
        let player = context.choosingPlayerOverride || this.getChoosingPlayer(context);
        if(player === context.player.opponent && context.stage === Stages.PreTarget) {
            targetResults.delayTargeting = this;
            return;
        }
        let buttons = [];
        let waitingPromptTitle = '';
        if(context.stage === Stages.PreTarget) {
            if(!targetResults.noCostsFirstButton) {
                buttons.push({ text: 'Pay costs first', arg: 'costsFirst' });
            }
            buttons.push({ text: 'Cancel', arg: 'cancel' });
            if(context.ability.abilityType === 'action') {
                waitingPromptTitle = 'Waiting for opponent to take an action or pass';
            } else {
                waitingPromptTitle = 'Waiting for opponent';
            }
        }
        let promptProperties = {
            waitingPromptTitle: waitingPromptTitle,
            context: context,
            buttons: buttons,
            onSelect: (player, ring) => {
                context.rings[this.name] = ring;
                if(this.name === 'target') {
                    context.ring = ring;
                }
                return true;
            },
            onCancel: () => {
                targetResults.cancelled = true;
                return true;
            },
            onMenuCommand: (player, arg) => {
                if(arg === 'costsFirst') {
                    targetResults.payCostsFirst = true;
                    return true;
                }
                return true;
            }
        };
        context.game.promptForRingSelect(player, _.extend(promptProperties, this.properties));
    }

    checkTarget(context) {
        if(context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player) {
            return false;
        }
        return context.rings[this.name] && 
            (this.properties.optional && context.rings[this.name].length === 0 || 
                this.properties.ringCondition(context.rings[this.name], context)) &&
            (!this.dependentTarget || this.dependentTarget.checkTarget(context));
    }

    getChoosingPlayer(context) {
        let playerProp = this.properties.player;
        if(typeof playerProp === 'function') {
            playerProp = playerProp(context);
        }
        return playerProp === Players.Opponent ? context.player.opponent : context.player;
    }

    hasTargetsChosenByInitiatingPlayer(context) {
        if(this.properties.gameAction.some(action => action.hasTargetsChosenByInitiatingPlayer(context))) {
            return true;
        }
        return this.getChoosingPlayer(context) === context.player;
    }
}

module.exports = AbilityTargetRing;
