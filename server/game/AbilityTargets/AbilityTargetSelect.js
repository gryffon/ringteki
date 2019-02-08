const _ = require('underscore');
const SelectChoice = require('./SelectChoice.js');
const { Stages, Players } = require('../Constants.js');

class AbilityTargetSelect {
    constructor(name, properties, ability) {
        this.name = name;
        this.properties = properties;
        for(const key of Object.keys(properties.choices)) {
            if(typeof properties.choices[key] !== 'function' && !Array.isArray(properties.choices[key])) {
                properties.choices[key] = [properties.choices[key]];
            }
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
        let keys = Object.keys(this.properties.choices);
        return keys.some(key => this.isChoiceLegal(key, context));
    }

    isChoiceLegal(key, context) {
        let contextCopy = context.copy();
        contextCopy.selects[this.name] = new SelectChoice(key);
        if(this.name === 'target') {
            contextCopy.select = key;
        }
        if(context.stage === Stages.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
            return false;
        }
        if(this.dependentTarget && !this.dependentTarget.hasLegalTarget(contextCopy)) {
            return false;
        }
        let choice = this.properties.choices[key];
        if(typeof choice === 'function') {
            return choice(contextCopy);
        }
        return choice.some(gameAction => gameAction.hasLegalTarget(contextCopy));
    }

    getGameAction(context) {
        let choice = this.properties.choices[context.selects[this.name].choice];
        if(typeof choice !== 'function') {
            return choice.filter(gameAction => gameAction.hasLegalTarget(context));
        }
        return [];
    }

    getAllLegalTargets(context) {
        return Object.keys(this.properties.choices).filter(key => this.isChoiceLegal(key, context));
    }

    resolve(context, targetResults) {
        if(targetResults.cancelled || targetResults.payCostsFirst || targetResults.delayTargeting) {
            return;
        }
        let playerProp = this.properties.player;
        if(typeof playerProp === 'function') {
            playerProp = playerProp(context);
        }
        let player = context.player;
        if(playerProp === Players.Opponent) {
            if(context.stage === Stages.PreTarget) {
                targetResults.delayTargeting = this;
                return;
            }
            player = player.opponent;
        }
        let promptTitle = this.properties.activePromptTitle || 'Select one';
        let choices = Object.keys(this.properties.choices).filter(key => (
            this.isChoiceLegal(key, context)
        ));
        let handlers = _.map(choices, choice => {
            return (() => {
                context.selects[this.name] = new SelectChoice(choice);
                if(this.name === 'target') {
                    context.select = choice;
                }
            });
        });
        if(playerProp !== Players.Opponent && context.stage === Stages.PreTarget) {
            if(!targetResults.noCostsFirstButton) {
                choices.push('Pay costs first');
                handlers.push(() => targetResults.payCostsFirst = true);
            }
            choices.push('Cancel');
            handlers.push(() => targetResults.cancelled = true);
        }
        if(handlers.length === 1) {
            handlers[0]();
        } else if(handlers.length > 1) {
            let waitingPromptTitle = '';
            if(context.stage === Stages.PreTarget) {
                if(context.ability.abilityType === 'action') {
                    waitingPromptTitle = 'Waiting for opponent to take an action or pass';
                } else {
                    waitingPromptTitle = 'Waiting for opponent';
                }
            }
            context.game.promptWithHandlerMenu(player, {
                waitingPromptTitle: waitingPromptTitle,
                activePromptTitle: promptTitle,
                context: context,
                source: this.properties.source || context.source,
                choices: choices,
                handlers: handlers
            });
        }
    }

    checkTarget(context) {
        return context.selects[this.name] && this.isChoiceLegal(context.selects[this.name].choice, context) &&
               (!this.dependentTarget || this.dependentTarget.checkTarget(context));
    }

    hasTargetsChosenByInitiatingPlayer(context) {
        return this.properties.choices.some(choice =>
            (typeof choice === 'object') &&
            choice.some(action => action.hasTargetsChosenByInitiatingPlayer(context))
        );
    }
}

module.exports = AbilityTargetSelect;
