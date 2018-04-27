const BowAction = require('./BowAction');
const ReadyAction = require('./ReadyAction');
const HonorAction = require('./HonorAction');
const DishonorAction = require('./DishonorAction');
const SendHomeAction = require('./SendHomeAction');
const MoveToConflictAction = require('./MoveToConflictAction');
const RemoveFateAction = require('./RemoveFateAction');
const BreakAction = require('./BreakAction');
const DiscardFromPlayAction = require('./DiscardFromPlayAction');
const ReturnToHandAction = require('./ReturnToHandAction');
const ReturnToDeckAction = require('./ReturnToDeckAction');
const PlaceFateAction = require('./PlaceFateAction');
const PutIntoPlayAction = require('./PutIntoPlayAction');


const GameActions = {
    bow: () => new BowAction(),
    ready: () => new ReadyAction(),
    honor: () => new HonorAction(),
    dishonor: () => new DishonorAction(),
    sendHome: () => new SendHomeAction(),
    moveToConflict: () => new MoveToConflictAction(),
    removeFate: (amount, recipient) => new RemoveFateAction(amount, recipient),
    break: () => new BreakAction(),
    discardFromPlay: () => new DiscardFromPlayAction(),
    returnToHand: () => new ReturnToHandAction(),
    returnToDeck: (bottom) => new ReturnToDeckAction(bottom),
    sacrifice: () => new DiscardFromPlayAction(true),
    placeFate: (amount) => new PlaceFateAction(amount),
    putIntoPlay: (fate) => new PutIntoPlayAction(fate, false),
    putIntoConflict: (fate) => new PutIntoPlayAction(fate)
};

module.exports = GameActions;
