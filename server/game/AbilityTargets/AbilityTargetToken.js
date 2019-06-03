const CardSelector = require('../CardSelector.js');
const { CardTypes, Stages, Players } = require('../Constants.js');

class AbilityTargetAbility {
    constructor(name, properties, ability) {
        this.name = name;
        this.properties = properties;
        this.selector = this.getSelector(properties);
        for(let gameAction of this.properties.gameAction) {
            gameAction.setDefaultTarget(context => context.tokens[name]);
        }
        this.dependentTarget = null;
        this.dependentCost = null;
        if(this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find(target => target.name === this.properties.dependsOn);
            dependsOnTarget.dependentTarget = this;
        }
    }

    getSelector(properties) {
        let cardCondition = (card, context) => {
            let token = card.personalHonor;
            if(!token) {
                return false;
            }
            let contextCopy = context.copy();
            contextCopy.tokens[this.name] = token;
            if(this.name === 'target') {
                contextCopy.token = token;
            }
            if(context.stage === Stages.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
                return false;
            }
            return (!properties.cardCondition || properties.cardCondition(card, contextCopy)) &&
                       (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy)) &&
                       properties.gameAction.some(gameAction => gameAction.hasLegalTarget(contextCopy));
        };
        return CardSelector.for(Object.assign({}, properties, { cardType: CardTypes.Character, cardCondition: cardCondition, targets: false }));
    }

    canResolve(context) {
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    hasLegalTarget(context) {
        return this.selector.optional || this.selector.hasEnoughTargets(context, this.getChoosingPlayer(context));
    }

    getAllLegalTargets(context) {
        return this.selector.getAllLegalTargets(context, this.getChoosingPlayer(context));
    }

    getGameAction(context) {
        return this.properties.gameAction.filter(gameAction => gameAction.hasLegalTarget(context));
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
            buttons.push({ text: 'Cancel', arg: 'cancel' });
            if(context.ability.abilityType === 'action') {
                waitingPromptTitle = 'Waiting for opponent to take an action or pass';
            } else {
                waitingPromptTitle = 'Waiting for opponent';
            }
        }
        let promptProperties = {
            waitingPromptTitle: waitingPromptTitle,
            buttons: buttons,
            context: context,
            selector: this.selector,
            onSelect: (player, card) => {
                context.tokens[this.name] = card.personalHonor;
                if(this.name === 'target') {
                    context.token = card.personalHonor;
                }
                return true;
            },
            onCancel: () => {
                targetResults.cancelled = true;
                return true;
            },
            onMenuCommand: (player, arg) => {
                if(arg === 'costsFirst') {
                    targetResults.costsFirst = true;
                    return true;
                }
                return true;
            }
        };
        context.game.promptForSelect(player, Object.assign(promptProperties, this.properties));
    }

    checkTarget(context) {
        if(!context.tokens[this.name] || context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player) {
            return false;
        }
        return this.selector.canTarget(context.tokens[this.name].card, context);
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

module.exports = AbilityTargetAbility;
