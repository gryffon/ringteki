const _ = require('underscore');

const CardSelector = require('../CardSelector.js');

class AbilityTargetCard {
    constructor(name, properties) {
        this.name = name;
        this.properties = properties;
        this.selector = CardSelector.for(properties);
    }

    canResolve(context) {
        return this.selector.hasEnoughTargets(context, true);
    }

    updateGameActions(context) {
        for(let action of this.properties.gameAction) {
            action.target(context => context.targets[this.name]);
            action.update(context);
        }
    }

    getGameAction(context) {
        return this.properties.gameAction.filter(gameAction => gameAction.setTarget(context.targets[this.name], context));
    }

    getAllLegalTargets(context) {
        return this.selector.getAllLegalTargets(context);
    }

    resolve(context, noCostsFirstButton = false) {
        let otherProperties = _.omit(this.properties, 'cardCondition');
        let result = { resolved: false, name: this.name, value: null, costsFirst: false, mode: this.properties.mode };
        let player = context.player;
        if(this.getAllLegalTargets(context).length === 0) {
            result.resolved = true;
            return result;
        }
        if(this.properties.player && this.properties.player === 'opponent') {
            if(context.stage === 'pretarget') {
                result.costsFirst = true;
                return result;
            }
            player = player.opponent;
        }
        let buttons = [];
        let waitingPromptTitle = '';
        if(this.properties.optional) {
            buttons.push({ text: 'No more targets', arg: 'noMoreTargets' });
        }
        if(context.stage === 'pretarget') {
            if(!noCostsFirstButton) {
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
            selector: this.selector,
            buttons: buttons,
            onSelect: (player, card) => {
                result.resolved = true;
                result.value = card;
                context.targets[this.name] = card;
                return true;
            },
            onCancel: () => {
                result.resolved = true;
                return true;
            },
            onMenuCommand: (player, arg) => {
                if(arg === 'costsFirst') {
                    result.costsFirst = true;
                    return true;
                } else if(arg === 'cancel') {
                    result.resolved = true;
                    return true;
                }
                result.resolved = true;
                result.value = arg;
                return true;
            }
        };
        context.game.promptForSelect(player, Object.assign(promptProperties, otherProperties));
        return result;
    }
    
    checkTarget(context) {
        if(this.properties.optional || context.targets[this.name] === 'noMoreTargets') {
            return true;
        } else if(!context.targets[this.name]) {
            return false;
        }
        let cards = context.targets[this.name];
        if(!Array.isArray(cards)) {
            cards = [cards];
        }
        return (cards.every(card => this.selector.canTarget(card, context)) &&
                this.selector.hasEnoughSelected(cards) &&
                !this.selector.hasExceededLimit(cards));
    }
}

module.exports = AbilityTargetCard;
