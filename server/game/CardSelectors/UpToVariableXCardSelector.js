const BaseCardSelector = require('./BaseCardSelector.js');

class UpToVariableXCardSelector extends BaseCardSelector {
    constructor(numCardsFunc, properties) {
        super(properties);
        this.numCardsFunc = numCardsFunc;
    }

    defaultActivePromptTitle(context) {
        return this.numCardsFunc(context) === 1 ? 'Select a character' : `Select ${this.numCardsFunc(context)} characters`;
    }

    hasReachedLimit(selectedCards, context) {
        return selectedCards.length >= this.numCardsFunc(context);
    }

    hasExceededLimit(selectedCards, context) {
        return selectedCards.length > this.numCardsFunc(context);
    }
}

module.exports = UpToVariableXCardSelector;
