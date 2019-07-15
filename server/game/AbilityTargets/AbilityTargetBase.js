const { HandlerAction } = require('../GameActions/HandlerAction');
const { Stages, Players } = require('../Constants.js');

class AbilityTargetBase {
    constructor(name, properties, ability) {
        this.name = name;
        this.properties = properties;
        this.dependentTarget = null;
        this.dependentCost = null;
        this.targetingAction = null;
        this.properties.gameAction.setDefaultTarget(context => context.targets[name]);
        if(this.properties.dependsOn) {
            const dependsOnTarget = ability.targets.find(target => target.name === this.properties.dependsOn);
            dependsOnTarget.dependentTarget = this;
        }
    }

    getTargetingGameAction(properties) {
        return new HandlerAction(context => ({
            hasTargetsChosenByInitiatingPlayer: properties.gameAction.some(action => action.hasTargetsChosenByInitiatingPlayer(context))
        }));
    }

    getTargetingActionPropFactory(properties) {
        const baseProps = {
            activePromptTitle: properties.activePromptTitle,
            gameAction: this.getTargetingGameAction(properties)
        };
        if(properties.targetingAction) {
            return context => {
                let targetingActionProps = properties.targetingAction;
                if(typeof targetingActionProps === 'function') {
                    targetingActionProps = targetingActionProps(context);
                }
                let player = properties.player;
                if(typeof player === 'function') {
                    player = player(context);
                }
                return Object.assign(baseProps, targetingActionProps, { player });
            };
        }
        if(properties.player) {
            return context => {
                let player = properties.player;
                if(typeof player === 'function') {
                    player = player(context);
                }
                return Object.assign(baseProps, { player });
            };
        }
        return () => baseProps;
    }

    canResolve(context) {
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    hasLegalTarget(context) {
        return this.targetingAction.hasLegalTarget(context);
    }

    getGameAction() {
        return [this.properties.gameAction];
    }

    resolve(context, targetResults) {
        if(targetResults.cancelled || targetResults.payCostsFirst || targetResults.delayTargeting) {
            return;
        }
        const player = this.properties.targets && context.choosingPlayerOverride || this.getChoosingPlayer(context);
        if(player === context.player.opponent && context.stage === Stages.PreTarget) {
            targetResults.delayTargeting = this;
            return;
        }
        let waitingPromptTitle;
        if(context.stage === Stages.PreTarget) {
            if(context.ability.abilityType === 'action') {
                waitingPromptTitle = 'Waiting for opponent to take an action or pass';
            } else {
                waitingPromptTitle = 'Waiting for opponent';
            }
        }
        const events = [];
        const additionalProps = this.getAdditionalProperties(context, targetResults, player !== context.player.opponent && context.stage === Stages.PreTarget);
        this.targetingAction.addEventsToArray(events, context, Object.assign({ waitingPromptTitle }, additionalProps));
        context.game.queueSimpleStep(() => context.game.openEventWindow(events));
    }

    getAdditionalProperties(context, targetResults, preTarget = false) {
        return {};
    }

    checkTarget(context) {
        return !this.properties.targets || !context.choosingPlayerOverride || this.getChoosingPlayer(context) !== context.player;
    }

    getChoosingPlayer(context) {
        let playerProp = this.properties.player;
        if(typeof playerProp === 'function') {
            playerProp = playerProp(context);
        }
        return playerProp === Players.Opponent ? context.player.opponent : context.player;
    }

    hasTargetsChosenByInitiatingPlayer(context) {
        return this.properties.targets || this.targetingAction.hasTargetsChosenByInitiatingPlayer(context);
    }
}

module.exports = AbilityTargetBase;
