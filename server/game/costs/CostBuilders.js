const CostBuilder = require('./CostBuilder.js');
const GameActions = require('../GameActions/GameActions');
const PlayerCost = require('./PlayerCost');
const RingCost = require('./RingCost');
const { Locations } = require('../Constants');

const CostBuilders = {
    bow: new CostBuilder(GameActions.bow(), {
        select: 'Select card to bow',
        selectMultiple: number => `Select ${number} cards to bow`
    }),
    break: new CostBuilder(GameActions.break(), {
        select: 'Select province to break',
        selectMultiple: number => `Select ${number} provinces to break`
    }),
    discardCard: new CostBuilder(GameActions.discardCard(), {
        select: 'Select card to discard',
        selectMultiple: number => `Select ${number} cards to discard`
    }),
    removeFate: new CostBuilder(GameActions.removeFate(), {
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
    shuffleIntoDeck: new CostBuilder(GameActions.moveCard({ destination: Locations.DynastyDeck, shuffle: true }), {
        select: 'Select a card to shuffle into deck',
        selectMultiple: number => `Select ${number} cards to shuffle into deck`
    }),
    discardImperialFavor: () => new PlayerCost(GameActions.loseImperialFavor()),
    giveFateToOpponent: (amount) => new PlayerCost(GameActions.takeFate({ amount })),
    giveHonorToOpponent: (amount) => new PlayerCost(GameActions.takeHonor({ amount })),
    payHonor: (amount) => new PlayerCost(GameActions.loseHonor({ amount })),
    payFate: (amount) => new PlayerCost(GameActions.loseFate({ amount })),
    payFateToRing: (amount, ringCondition) => new RingCost(GameActions.placeFateOnRing({ amount }), ringCondition)
};

module.exports = CostBuilders;
