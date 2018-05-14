const CostBuilder = require('./CostBuilder.js');
const GameActions = require('../GameActions/GameActions');
const PlayerCost = require('./PlayerCost');
const RingCost = require('./RingCost');

const CostBuilders = {
    bow: new CostBuilder(GameActions.bow(), {
        select: 'Select card to bow',
        selectMultiple: number => `Select ${number} cards to bow`
    }),
    break: new CostBuilder(GameActions.break(), {
        select: 'Select province to break',
        selectMultiple: number => `Select ${number} provinces to break`
    }),
    discardFromHand: new CostBuilder(GameActions.discardFromHand(), {
        select: 'Select card to discard from hand',
        selectMultiple: number => `Select ${number} cards to discard from hand`
    }),
    discardFate: new CostBuilder(GameActions.removeFate(), {
        select: 'Select character to discard a fate from',
        selectMultiple: number => `Select ${number} cards to discard a fate from`
    }),
    dishonor: new CostBuilder(GameActions.dishonor(), {
        select: 'Select character to dishonor',
        selectMultiple: number => `Select ${number} characters to dishonor`
    }),
    putIntoPlay: new CostBuilder(GameActions.putIntoPlay(), {
        select: 'Select character to put into play',
        selectMultiple: number => `Select ${number} characters to put into play`
    }),
    returnToHand: new CostBuilder(GameActions.returnToHand(), {
        select: 'Select card to return to hand',
        selectMultiple: number => `Select ${number} cards to return to hand`
    }),
    reveal: new CostBuilder(GameActions.reveal(), {
        select: 'Select card to reveal',
        selectMultiple: number => `Select ${number} cards to reveal`        
    }),
    sacrifice: new CostBuilder(GameActions.sacrifice(), {
        select: 'Select card to sacrifice',
        selectMultiple: number => `Select ${number} cards to sacrifice`
    }),
    discardImperialFavor: () => new PlayerCost(GameActions.loseImperialFavor()),
    giveFateToOpponent: (amount) => new PlayerCost(GameActions.takeFate(amount)),
    payHonor: (amount) => new PlayerCost(GameActions.gainHonor(-amount)),
    payFate: (amount) => new PlayerCost(GameActions.gainFate(-amount)),
    payFateToRing: (ringCondition, amount) => new RingCost(GameActions.placeFateOnRing(amount), ringCondition)
};

module.exports = CostBuilders;
