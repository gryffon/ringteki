class BaseCardSelector {
    constructor(properties) {
        this.cardCondition = properties.cardCondition;
        this.cardType = properties.cardType;
        this.optional = properties.optional;
        this.location = this.buildLocation(properties.location);
        this.controller = properties.controller || 'any';

        if(!Array.isArray(properties.cardType)) {
            this.cardType = [properties.cardType];
        }
    }

    buildLocation(property) {
        this.location = property || 'play area';
        if(!Array.isArray(this.location)) {
            this.location = [this.location];
        }
        let index = this.location.indexOf('province');
        if(index > -1) {
            this.location = this.location.slice(index, 1, 'province 1', 'province 2', 'province 3', 'province 4', 'stronghold province');
        }
    }

    findPossibleCards(context) {
        if(this.location.includes('any')) {
            return context.game.allCards.toArray(); 
        }
        let possibleCards = [];
        if(this.controller !== 'opponent') {
            for(const l of this.location) {
                let cards = context.player.getSourceList(l).toArray();
                possibleCards = possibleCards.concat(cards);
                if(l === 'play area') {
                    possibleCards = possibleCards.concat(cards.map(card => card.attachments.toArray()));
                }
            }
        }
        if(this.controller !== 'self' && context.player.opponent) {
            for(const l of this.location) {
                let cards = context.player.opponent.getSourceList(l).toArray();
                possibleCards = possibleCards.concat(cards);
                if(l === 'play area') {
                    possibleCards = possibleCards.concat(cards.map(card => card.attachments.toArray()));
                }
            }
        }
        return possibleCards;
    }

    canTarget(card, context) {
        if(!card) {
            return false;
        }
        if(context.stage.includes('target') && !card.checkRestrictions('target', context)) {
            return false;
        }
        return this.cardType.includes(card.getType()) && this.cardCondition(card, context);
    }

    getAllLegalTargets(context) {
        return this.findPossibleCards(context).filter(card => this.canTarget(card, context));
    }

    hasEnoughSelected(selectedCards) {
        return this.optional || selectedCards.length > 0;
    }

    hasEnoughTargets(context) {
        return (this.optional || this.findPossibleCards(context).some(card => this.canTarget(card, context)));
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
