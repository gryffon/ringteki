const BowAction = require('./BowAction');

const GameActions = {
    bow: () => new BowAction(),
    ready: () => new ReadyAction(),
    honor: () => new HonorAction(),
    dishonor: () => new DisonorAction(),
    sendHome: () => new SendHomeAction(),
    moveToConflict: () => new MoveToConflictAction(),
    moveFate: (amount, to) => new MoveFateAction(amount, to),
    break: () => new BreakAction(),
    discardFromPlay: () => new DiscardFromPlayAction(),
    returnToHand: () => new ReturnToHandAction(),
    returnToDeck: (bottom) => new ReturnToDeckAction(bottom),
    sacrifice: () => new DiscardFromPlayAction(true),
    placeFate: (amount) => new PlaceFateAction(amount),
    putIntoPlay: card => new PutIntoPlayAction(),
    putIntoConflict: card => new PutIntoPlayAction(true)
};

module.exports = GameActions;
