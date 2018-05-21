class BaseCardSelector {
    constructor(properties) {
        this.cardCondition = properties.cardCondition;
        this.cardType = properties.cardType;
        this.optional = properties.optional;
        this.gameAction = properties.gameAction;

        if(!Array.isArray(properties.cardType)) {
            this.cardType = [properties.cardType];
        }
    }

    canTarget(card, context) {
        if(!card) {
            return false;
        }
        if(context.stage === 'pretarget' && context.ability && !context.ability.canPayCosts(context, card)) {
            return false;
        }
        if(context.stage.includes('target') && !card.checkRestrictions('target', context)) {
            return false;
        }
        if(this.gameAction && this.gameAction.length > 0 && this.gameAction.every(action => !action.canAffect(card, context))) {
            return false;
        }
        return this.cardType.includes(card.getType()) && this.cardCondition(card, context);
    }

    getAllLegalTargets(context) {
        return context.game.allCards.filter(card => this.canTarget(card, context));
    }

    hasEnoughSelected(selectedCards) {
        return this.optional || selectedCards.length > 0;
    }

    hasEnoughTargets(context) {
        return (this.optional || context.game.allCards.any(card => this.canTarget(card, context)));
    }

    defaultActivePromptTitle() {
        return 'Choose cards';
    }

    automaticFireOnSelect() {
        return false;
    }

    wouldExceedLimit(selectedCards, card) { // eslint-disable-line no-unused-vars
        return false;
    }

    hasReachedLimit(selectedCards) { // eslint-disable-line no-unused-vars
        return false;
    }
    
    hasExceededLimit(selectedCards) { // eslint-disable-line no-unused-vars
        return false;
    }

    formatSelectParam(cards) {
        return cards;
    }
}

module.exports = BaseCardSelector;
