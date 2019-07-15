const _ = require('underscore');

const AbilityTargetBase = require('./AbilityTargetBase');
const { SelectCardAction } = require('../GameActions/SelectCardAction');
const { Stages } = require('../Constants.js');

class AbilityTargetCard extends AbilityTargetBase {
    constructor(name, properties, ability) {
        super(name, properties, ability);
        this.targetingAction = new SelectCardAction(this.getTargetingActionPropFactory(properties));
    }

    getTargetingActionPropFactory(properties) {
        const props = {
            targets: true,
            cardType: properties.cardType,
            mode: properties.mode,
            controller: properties.controller,
            optional: properties.optional,
            numCards: properties.numCards,
            location: properties.location,
            cardStat: properties.cardStat,
            maxStat: properties.maxStat
        }
        return context => {
            const baseProps = super.getTargetingActionPropFactory(properties)(context);
            const extendedCardCondition = this.getCardCondition(properties, properties.cardCondition || baseProps.cardCondition);
            return Object.assign(props, baseProps, { cardCondition: extendedCardCondition });
        }
    }

    getCardCondition(properties, cardCondition) {
        return (card, context) => {
            let contextCopy = context.copy();
            contextCopy.targets[this.name] = card;
            if(this.name === 'target') {
                contextCopy.target = card;
            }
            if(context.stage === Stages.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
                return false;
            }
            return (!cardCondition || cardCondition(card, contextCopy)) &&
                   (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy)) &&
                   (!properties.gameAction || properties.gameAction.hasLegalTarget(contextCopy));
        };
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
            subActionProperties: card => ({
                handler: () => {
                    context.targets[this.name] = card;
                    if(this.name === 'target') {
                        context.target = card;
                    }
                }
            })
        }
    }

    checkTarget(context) {
        if(!context.targets[this.name]) {
            return false;
        } else if(context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player) {
            return false;
        }
        let cards = context.targets[this.name];
        if(!Array.isArray(cards)) {
            cards = [cards];
        }
        return cards.every(card => this.targetingAction.canAffect(card, context));
    }
}

module.exports = AbilityTargetCard;
