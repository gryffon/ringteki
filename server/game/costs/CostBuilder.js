const ParentCost = require('./ParentCost.js');
const SelectCardCost = require('./SelectCardCost.js');
const SelfCost = require('./SelfCost.js');
const SpecificCardCost = require('./SpecificCardCost.js');

const { TargetModes } = require('../Constants');

class CostBuilder {
    constructor(action, titles = {}) {
        this.action = action;
        this.titles = titles;
    }

    /**
     * Returns a cost that is applied to the card that activated the ability.
     */
    self() {
        return new SelfCost(this.action);
    }

    /**
     * Returns a cost that is applied to the card returned by the cardFunc param.
     * @param {function} cardFunc Function that takes the ability context and return a card.
     */
    specific(cardFunc) {
        return new SpecificCardCost(this.action, cardFunc);
    }

    /**
     * Returns a cost that asks the player to select a card matching the passed condition.
     * @param {object} properties Card Selector properties.
     */
    select(properties = {}) {
        return new SelectCardCost(this.action, Object.assign({
            activePromptTitle: this.titles.select,
            cardCondition: () => true
        }, properties));
    }

    /**
     * Returns a cost that asks the player to select an exact number of cards matching the passed condition.
     * @param {object} properties Card Selector properties.
     */
    selectMultiple(properties = {}) {
        return new SelectCardCost(this.action, Object.assign({
            mode: TargetModes.Exactly,
            activePromptTitle: this.titles.selectMultiple(properties.numCards),
            cardCondition: () => true
        }, properties));
    }

    /**
     * Returns a cost that is applied to the parent card that the activating card is attached to.
     */
    parent() {
        return new ParentCost(this.action);
    }
}

module.exports = CostBuilder;
