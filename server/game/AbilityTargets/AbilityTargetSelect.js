const _ = require('underscore');
const SelectChoice = require('./SelectChoice.js');

class AbilityTargetSelect {
    constructor(name, properties) {
        this.name = name;
        this.properties = properties;
    }

    canResolve(context) {
        return _.any(this.properties.choices, condition => condition(context)) && context.ability.canPayCosts(context);
    }

    getGameAction(context) {
        let choice = this.properties.choices[context.targets[this.name]];
        if(typeof choice !== 'function') {
            if(!Array.isArray(choice)) {
                choice = [choice];
            }
            return choice.filter(action => action.hasLegalTarget(context));
        }
        return [];
    }

    getAllLegalTargets(context) {
        return _.filter(this.properties.choices, condition => condition(context));
    }

    resolve(context, pretarget = false, noCostsFirstButton = false) {
        let result = { resolved: false, name: this.name, value: null, costsFirst: false, mode: 'select' };
        let player = context.player;
        if(this.properties.player && this.properties.player === 'opponent') {
            if(pretarget) {
                result.costsFirst = true;
                return result;
            }
            player = player.opponent;
        }
        let promptTitle = this.properties.activePromptTitle || 'Select one';
        let choices = Object.values(this.properties.choices).filter(value => {
            if(typeof value === 'function') {
                return value(context);
            }
            // value is a gameActions or an Array of game actions
            let gameAction = value;
            if(!Array.isArray(value)) {
                gameAction = [value];
            }
            return gameAction.some(action => action.hasLegalTarget(context));
        });
        let handlers = _.map(choices, choice => {
            return (() => {
                result.resolved = true;
                result.value = choice;
                context.selects[this.name] = new SelectChoice(result.value);
            });
        });
        if(this.properties.player !== 'opponent' && pretarget) {
            if(!noCostsFirstButton) {
                choices.push('Pay costs first');
                handlers.push(() => result.costsFirst = true);
            }
            choices.push('Cancel');
            handlers.push(() => result.resolved = true);
        }
        if(handlers.length === 1) {
            handlers[0]();
        } else if(handlers.length > 1) {
            let waitingPromptTitle = '';
            if(pretarget) {
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
        return result;
    }
    
    checkTarget(context) {
        return this.properties.choices[context.selects[this.name].choice](context);
    }
}

module.exports = AbilityTargetSelect;
