const BaseCardSelector = require('./BaseCardSelector.js');

class ExactlyVariableXCardSelector extends BaseCardSelector {
    constructor(numCardsFunc, properties) {
        super(properties);
        this.numCardsFunc = numCardsFunc;
    }

    hasExceededLimit(selectedCards, context) {
        return selectedCards.length > this.numCardsFunc(context);
    }

    defaultActivePromptTitle(context) {
        if(this.cardType.length === 1) {
            return this.numCardsFunc(context) === 1 ? 'Choose a ' + this.cardType[0] : `Choose ${this.numCardsFunc(context)} ${this.cardType[0]}s`;
        }
        return this.numCardsFunc(context) === 1 ? 'Select a card' : `Select ${this.numCardsFunc(context)} cards`;
    }

    hasEnoughSelected(selectedCards, context) {
        return selectedCards.length === this.numCardsFunc(context);
    }

    hasEnoughTargets(context, choosingPlayer) {
        let numMatchingCards = context.game.allCards.reduce((total, card) => {
            if(this.canTarget(card, context, choosingPlayer)) {
                return total + 1;
            }
            return total;
        }, 0);

        return numMatchingCards >= this.numCardsFunc(context);
    }

    hasReachedLimit(selectedCards, context) {
        return selectedCards.length >= this.numCardsFunc(context);
    }

    automaticFireOnSelect(context) {
        return this.numCardsFunc(context) === 1;
    }
}

module.exports = ExactlyVariableXCardSelector;
