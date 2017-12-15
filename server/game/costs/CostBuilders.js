const BowCost = require('./BowCost.js');
const BreakCost = require('./BreakCost.js');
const CostBuilder = require('./CostBuilder.js');
const DiscardFromHandCost = require('./DiscardFromHandCost.js');
const DiscardFateCost = require('./DiscardFateCost.js');
const DishonorCost = require('./DishonorCost.js');
const PutIntoPlayCost = require('./PutIntoPlayCost.js');
const ReturnToHandCost = require('./ReturnToHandCost.js');
const SacrificeCost = require('./SacrificeCost.js');

const CostBuilders = {
    bow: new CostBuilder(new BowCost(), {
        select: 'Select card to bow',
        selectMultiple: number => `Select ${number} cards to bow`
    }),
    break: new CostBuilder(new BreakCost(), {
        select: 'Select province to break',
        selectMultiple: number => `Select ${number} provinces to break`
    }),
    discardFromHand: new CostBuilder(new DiscardFromHandCost(), {
        select: 'Select card to discard from hand',
        selectMultiple: number => `Select ${number} cards to discard from hand`
    }),
    discardFate: new CostBuilder(new DiscardFateCost(), {
        select: 'Select character to discard a fate from',
        selectMultiple: number => `Select ${number} cards to discard a fate from`
    }),
    dishonor: new CostBuilder(new DishonorCost(), {
        select: 'Select character to dishonor',
        selectMultiple: number => `Select ${number} characters to dishonor`
    }),
    putIntoPlay: new CostBuilder(new PutIntoPlayCost(), {
        select: 'Select card to put into play',
        selectMultiple: number => `Select ${number} cards to put into play`
    }),
    returnToHand: new CostBuilder(new ReturnToHandCost(), {
        select: 'Select card to return to hand',
        selectMultiple: number => `Select ${number} cards to return to hand`
    }),
    sacrifice: new CostBuilder(new SacrificeCost(), {
        select: 'Select card to sacrifice',
        selectMultiple: number => `Select ${number} cards to sacrifice`
    })
};

module.exports = CostBuilders;
