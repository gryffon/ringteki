const _ = require('underscore');
const SelectChoice = require('./SelectChoice.js');

class AbilityTargetSelect {
    constructor(name, properties) {
        this.name = name;
        this.properties = properties;
    }

    canResolve(context) {
        let choices = Object.values(this.properties.choices);
        return choices.some(choice => this.isChoiceLegal(choice, context)) && context.ability.canPayCosts(context);
    }

    isChoiceLegal(choice, context) {
        if(typeof choice === 'function') {
            return choice(context);
        }
        return choice.some(action => action.setTarget(action.targetFunc(context), context));
    }

    updateGameActions(context) {
        for(const key in this.properties.choices) {
            if(typeof this.properties.choices[key] !== 'function') {
                if(!Array.isArray(this.properties.choices[key])) {
                    this.properties.choices[key] = [this.properties.choices[key]];
                }
                for(let action of this.properties.choices[key]) {
                    action.update(context);
                }
            }
        }
    }

    getGameAction(context) {
        let choice = this.properties.choices[context.selects[this.name].choice];
        if(typeof choice !== 'function') {
            return choice.filter(action => action.hasLegalTarget(context));
        }
        return [];
    }

    getAllLegalTargets(context) {
        return Object.keys(this.properties.choices).filter(key => this.isChoiceLegal(this.properties.choices[key], context));
    }

    resolve(context, noCostsFirstButton = false) {
        let result = { resolved: false, name: this.name, value: null, costsFirst: false, mode: 'select' };
        let player = context.player;
        if(this.properties.player && this.properties.player === 'opponent') {
            if(context.stage === 'pretarget') {
                result.costsFirst = true;
                return result;
            }
            player = player.opponent;
        }
        let promptTitle = this.properties.activePromptTitle || 'Select one';
        let choices = Object.keys(this.properties.choices).filter(key => (
            this.isChoiceLegal(this.properties.choices[key], context)
        ));
        let handlers = _.map(choices, choice => {
            return (() => {
                result.resolved = true;
                result.value = choice;
                context.selects[this.name] = new SelectChoice(choice);
            });
        });
        if(this.properties.player !== 'opponent' && context.stage === 'pretarget') {
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
            if(context.stage === 'pretarget') {
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
        return this.isChoiceLegal(this.properties.choices[context.selects[this.name].choice], context);
    }
}

module.exports = AbilityTargetSelect;
