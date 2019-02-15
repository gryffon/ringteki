const _ = require('underscore');

const CardSelector = require('../CardSelector.js');
const { Stages, Players, EffectNames, TargetModes } = require('../Constants.js');

class AbilityTargetCard {
    constructor(name, properties, ability) {
        this.name = name;
        this.properties = properties;
        for(let gameAction of this.properties.gameAction) {
            gameAction.setDefaultTarget(context => context.targets[name]);
        }
        this.selector = this.getSelector(properties);
        this.dependentTarget = null;
        this.dependentCost = null;
        if(this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find(target => target.name === this.properties.dependsOn);
            dependsOnTarget.dependentTarget = this;
        }
    }

    getSelector(properties) {
        let cardCondition = (card, context) => {
            let contextCopy = context.copy();
            contextCopy.targets[this.name] = card;
            if(this.name === 'target') {
                contextCopy.target = card;
            }
            if(context.stage === Stages.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
                return false;
            }
            return (!properties.cardCondition || properties.cardCondition(card, contextCopy)) &&
                   (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy)) &&
                   (properties.gameAction.length === 0 || properties.gameAction.some(gameAction => gameAction.hasLegalTarget(contextCopy)));
        };
        return CardSelector.for(Object.assign({}, properties, { cardCondition: cardCondition, targets: true }));
    }

    canResolve(context) {
        // if this depends on another target, that will check hasLegalTarget already
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    hasLegalTarget(context) {
        return this.selector.hasEnoughTargets(context);
    }

    getGameAction(context) {
        return this.properties.gameAction.filter(gameAction => gameAction.hasLegalTarget(context));
    }

    getAllLegalTargets(context) {
        return this.selector.getAllLegalTargets(context);
    }

    resolve(context, targetResults) {
        if(targetResults.cancelled || targetResults.payCostsFirst || targetResults.delayTargeting) {
            return;
        }
        if(this.properties.mode === TargetModes.AutoSingle) {
            let legalTargets = this.selector.getAllLegalTargets(context);
            if(legalTargets.length === 1) {
                context.targets[this.name] = legalTargets[0];
                return;
            }
        }
        let otherProperties = _.omit(this.properties, 'cardCondition', 'player');
        let player = context.choosingPlayerOverride || this.getChoosingPlayer(context);
        if(player === context.player.opponent && context.stage === Stages.PreTarget) {
            targetResults.delayTargeting = this;
            return;
        }
        let buttons = [];
        let waitingPromptTitle = '';
        if(this.properties.optional) {
            buttons.push({ text: 'No more targets', arg: 'noMoreTargets' });
        }
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
        let mustSelect = this.selector.getAllLegalTargets(context).filter(card =>
            card.getEffects(EffectNames.MustBeChosen).some(restriction => restriction.isMatch('target', context))
        );
        let promptProperties = {
            waitingPromptTitle: waitingPromptTitle,
            context: context,
            selector: this.selector,
            buttons: buttons,
            mustSelect: mustSelect,
            onSelect: (player, card) => {
                context.targets[this.name] = card;
                if(this.name === 'target') {
                    context.target = card;
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
        context.game.promptForSelect(player, Object.assign(promptProperties, otherProperties));
    }

    checkTarget(context) {
        if(this.properties.optional || context.targets[this.name] === 'noMoreTargets') {
            return (!this.dependentTarget || this.dependentTarget.checkTarget(context));
        } else if(!context.targets[this.name]) {
            return false;
        } else if(context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player) {
            return false;
        }
        let cards = context.targets[this.name];
        if(!Array.isArray(cards)) {
            cards = [cards];
        }
        return (cards.every(card => this.selector.canTarget(card, context)) &&
                this.selector.hasEnoughSelected(cards) &&
                !this.selector.hasExceededLimit(cards)) &&
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

module.exports = AbilityTargetCard;
