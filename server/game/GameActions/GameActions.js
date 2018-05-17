const AttachAction = require('./AttachAction');
const BowAction = require('./BowAction');
const BreakAction = require('./BreakAction');
const ChosenDiscardAction = require('./ChosenDiscardAction');
const DiscardFavorAction = require('./DiscardFavorAction');
const DiscardFromPlayAction = require('./DiscardFromPlayAction');
const DiscardFromHandAction = require('./DiscardFromHandAction');
const DiscardStatusAction = require('./DiscardStatusAction');
const DishonorAction = require('./DishonorAction');
const DrawAction = require('./DrawAction');
const DuelAction = require('./DuelAction');
const FireRingAction = require('./FireRingAction');
const FlipDynastyAction = require('./FlipDynastyAction');
const GainHonorAction = require('./GainHonorAction');
const HonorAction = require('./HonorAction');
const LoseHonorAction = require('./LoseHonorAction');
const ModifyFateAction = require('./ModifyFateAction');
const MoveToConflictAction = require('./MoveToConflictAction');
const PlaceFateAction = require('./PlaceFateAction');
const PlaceFateRingAction = require('./PlaceFateRingAction');
const PutIntoPlayAction = require('./PutIntoPlayAction');
const RandomDiscardAction = require('./RandomDiscardAction');
const ReadyAction = require('./ReadyAction');
const RemoveFateAction = require('./RemoveFateAction');
const ResolveRingAction = require('./ResolveRingAction');
const ReturnToDeckAction = require('./ReturnToDeckAction');
const ReturnToHandAction = require('./ReturnToHandAction');
const RevealAction = require('./RevealAction');
const SendHomeAction = require('./SendHomeAction');
const TakeFateRingAction = require('./TakeFateRingAction');
const TransferFateAction = require('./TransferFateAction');
const TransferHonorAction = require('./TransferHonorAction');

const GameActions = {
    // card actions
    attach: (attachment) => new AttachAction(attachment),
    bow: () => new BowAction(),
    break: () => new BreakAction(),
    discardFromHand: () => new DiscardFromHandAction(),
    discardFromPlay: () => new DiscardFromPlayAction(),
    discardStatusToken: () => new DiscardStatusAction(),
    dishonor: () => new DishonorAction(),
    duel: (type, resolutionHandler, challenger, costHandler) => new DuelAction(type, resolutionHandler, challenger, costHandler),
    fireRingEffect: () => new FireRingAction(),
    flipDynasty: () => new FlipDynastyAction(),
    honor: () => new HonorAction(),
    moveToConflict: () => new MoveToConflictAction(),
    placeFate: (amount = 1, origin) => new PlaceFateAction(amount, origin),
    putIntoConflict: (fate = 0) => new PutIntoPlayAction(fate),
    putIntoPlay: (fate = 0) => new PutIntoPlayAction(fate, false),
    ready: () => new ReadyAction(),
    removeFate: (amount = 1, recipient) => new RemoveFateAction(amount, recipient),
    returnToDeck: (bottom = false) => new ReturnToDeckAction(bottom),
    returnToHand: () => new ReturnToHandAction(),
    reveal: () => new RevealAction(),
    sendHome: () => new SendHomeAction(),
    sacrifice: () => new DiscardFromPlayAction(true),
    // player actions
    chosenDiscard: (amount = 1) => new ChosenDiscardAction(amount),
    discardAtRandom: (amount = 1) => new RandomDiscardAction(amount),
    draw: (amount = 1) => new DrawAction(amount),
    gainFate: (amount = 1) => new ModifyFateAction(amount),
    gainHonor: (amount = 1) => new GainHonorAction(amount),
    loseHonor: (amount = 1) => new LoseHonorAction(amount),
    loseImperialFavor: () => new DiscardFavorAction(),
    takeFate: (amount = 1) => new TransferFateAction(amount),
    takeHonor: (amount = 1) => new TransferHonorAction(amount),
    // ring actions
    placeFateOnRing: (amount = 1, origin) => new PlaceFateRingAction(amount, origin),
    resolveRing: (resolveAsAttacker = true) => new ResolveRingAction(resolveAsAttacker),
    takeFateFromRing: (amount = 1) => new TakeFateRingAction(amount)
};

module.exports = GameActions;
