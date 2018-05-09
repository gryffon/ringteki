const CardSelector = require('../CardSelector.js');

class SelectCardCost {
    constructor(action, promptProperties) {
        this.action = action;
        this.selector = this.createSelector(action, promptProperties);
        this.activePromptTitle = promptProperties.activePromptTitle;
    }

    createSelector(action, properties) {
        let condition = (card, context) => {
            return card.controller === context.player && action.canAffect(card, context) && properties.cardCondition(card, context);
        };

        let fullProperties = Object.assign({}, properties, { cardCondition: condition });

        return CardSelector.for(fullProperties);
    }

    canPay(context) {
        return this.selector.hasEnoughTargets(context);
    }

    resolve(context, result = { resolved: false }) {
        context.game.promptForSelect(context.player, {
            activePromptTitle: this.activePromptTitle,
            context: context,
            selector: this.selector,
            source: context.source,
            buttons: [{ text: 'Cancel', arg: 'cancel' }],
            onSelect: (player, cards) => {
                context.costs[this.action.name] = cards;
                result.value = this.action.setTarget(cards, context);
                result.resolved = true;

                return true;
            },
            onCancel: () => {
                result.value = false;
                result.resolved = true;
            }
        });

        return result;
    }

    payEvent() {
        return this.action.getEventArray();
    }
}

module.exports = SelectCardCost;
