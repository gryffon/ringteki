const _ = require('underscore');

class AbilityTargetAbility {
    constructor(name, properties) {
        this.name = name;
        this.properties = properties;
    }

    canResolve(context) {
        return !!this.getAllLegalTargets(context);
    }

    getAllLegalTargets(context) {
        return context.game.findAnyCardsInPlay(card => this.properties.cardCondition(card, context));
    }

    resolve(context, pretarget = false) {
        let otherProperties = _.omit(this.properties, 'cardCondition');
        let result = { resolved: false, name: this.name, value: null, costsFirst: false, mode: this.properties.mode };
        let player = context.player;
        if(this.getAllLegalTargets(context).length === 0) {
            result.resolved = true;
            return result;
        }
        let buttons = [];
        if(pretarget) {
            buttons.push({ text: 'Cancel', arg: 'cancel' });
        }
        let waitingPromptTitle = '';
        if(pretarget) {
            if(context.ability.abilityType === 'action') {
                waitingPromptTitle = 'Waiting for opponent to take an action or pass';
            } else {
                waitingPromptTitle = 'Waiting for opponent';
            }
        }
        let promptProperties = {
            waitingPromptTitle: waitingPromptTitle,
            context: context,
            source: context.source,
            buttons: buttons,
            pretarget: pretarget,
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
        this.selector.setGameAction(this.properties.gameAction, context);
        return (cards.every(card => this.selector.canTarget(card, context)) &&
                this.selector.hasEnoughSelected(cards) &&
                !this.selector.hasExceededLimit(cards));
    }
}

module.exports = AbilityTargetAbility;
