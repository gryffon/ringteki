class BaseCardSelector {
    constructor(properties) {
        this.cardCondition = properties.cardCondition;
        this.cardType = properties.cardType;
        this.optional = properties.optional;
        this.gameAction = [];

        if(!Array.isArray(properties.cardType)) {
            this.cardType = [properties.cardType];
        }
    }

    setGameAction(gameAction = [], context) {
        if(typeof gameAction === 'function') {
            gameAction = gameAction(context);
        }
        if(!Array.isArray(gameAction)) {
            gameAction = [gameAction];
        }
        for(let action of gameAction) {
            action.context = context;
        }
        this.gameAction = gameAction;
    }

    canTarget(card, context, pretarget = false) {
        if(!card) {
            return false;
        }
        if(pretarget && context.ability && !context.ability.canPayCosts(context, card)) {
            return false;
        }
        if(context.stage === 'target' && !card.allowGameAction('target', context)) {
            return false;
        }
        if(this.gameAction.length > 0 && this.gameAction.every(action => !action.canAffect(card))) {
            return false;
        }
        return this.cardType.includes(card.getType()) && this.cardCondition(card, context);
    }

    getAllLegalTargets(context, pretarget) {
        return context.game.allCards.filter(card => this.canTarget(card, context, pretarget));
    }

    hasEnoughSelected(selectedCards) {
        return this.optional || selectedCards.length > 0;
    }

    hasEnoughTargets(context, pretarget = false) {
        return (this.optional || context.game.allCards.any(card => this.canTarget(card, context, pretarget)));
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
