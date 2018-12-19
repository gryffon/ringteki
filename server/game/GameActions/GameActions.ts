import AbilityContext from '../AbilityContext';
import { AttachAction, AttachActionProperties } from './AttachAction';
import { BowAction, BowActionProperties } from './BowAction';
import { BreakAction, BreakProperties } from './BreakAction';
import { ChooseGameAction, ChooseActionProperties } from './ChooseGameAction';
import { ChosenDiscardAction, ChosenDiscardProperties } from './ChosenDiscardAction';
import { CreateTokenAction, CreateTokenProperties } from './CreateTokenAction';
import { DeckSearchAction,  } from './DeckSearchAction';
import { DelayedEffectAction,  } from './DelayedEffectAction';
import { DiscardFavorAction,  } from './DiscardFavorAction';
import { DiscardFromPlayAction,  } from './DiscardFromPlayAction';
import { DiscardCardAction,  } from './DiscardCardAction';
import { DiscardStatusAction,  } from './DiscardStatusAction';
import { DishonorAction,  } from './DishonorAction';
import { DrawAction,  } from './DrawAction';
import { DuelAction,  } from './DuelAction';
import { FlipDynastyAction,  } from './FlipDynastyAction';
import { GainFateAction,  } from './GainFateAction';
import { GainHonorAction,  } from './GainHonorAction';
import { HonorAction,  } from './HonorAction';
import { InitiateConflictAction,  } from './InitiateConflictAction';
import { JointGameAction,  } from './JointGameAction';
import { LastingEffectAction,  } from './LastingEffectAction';
import { LastingEffectCardAction,  } from './LastingEffectCardAction';
import { LastingEffectRingAction,  } from './LastingEffectRingAction';
import { LookAtAction,  } from './LookAtAction';
import { LoseHonorAction,  } from './LoseHonorAction';
import { ModifyBidAction,  } from './ModifyBidAction';
import { MoveCardAction,  } from './MoveCardAction';
import { MoveToConflictAction,  } from './MoveToConflictAction';
import { PlaceFateAction,  } from './PlaceFateAction';
import { PlaceFateRingAction,  } from './PlaceFateRingAction';
import { PlayCardAction,  } from './PlayCardAction';
import { PutIntoPlayAction,  } from './PutIntoPlayAction';
import { RandomDiscardAction,  } from './RandomDiscardAction';
import { ReadyAction,  } from './ReadyAction';
import { RefillFaceupAction,  } from './RefillFaceupAction';
import { RemoveFateAction,  } from './RemoveFateAction';
import { ResolveAbilityAction,  } from './ResolveAbilityAction';
import { ResolveConflictRingAction,  } from './ResolveConflictRingAction';
import { ResolveElementAction,  } from './ResolveElementAction';
import { ReturnRingAction,  } from './ReturnRingAction';
import { ReturnToDeckAction,  } from './ReturnToDeckAction';
import { ReturnToHandAction,  } from './ReturnToHandAction';
import { RevealAction,  } from './RevealAction';
import { SendHomeAction,  } from './SendHomeAction';
import { SequentialAction,  } from './SequentialAction';
import { SetDialAction,  } from './SetDialAction';
import { TakeFateRingAction,  } from './TakeFateRingAction';
import { TakeRingAction,  } from './TakeRingAction';
import { TransferFateAction,  } from './TransferFateAction';
import { TransferHonorAction,  } from './TransferHonorAction';

const GameActions = {
    // card actions
    attach: (propertyFactory?: AttachActionProperties) => new AttachAction(propertyFactory), // attachment
    bow: (propertyFactory?: BowActionProperties | ((context: AbilityContext) => BowActionProperties)) => new BowAction(propertyFactory),
    break: (propertyFactory?: BreakProperties) => new BreakAction(propertyFactory),
    cardLastingEffect: (propertyFactory) => new LastingEffectCardAction(propertyFactory), // duration = 'untilEndOfConflict', effect, targetLocation, condition, until
    createToken: (propertyFactory) => new CreateTokenAction(propertyFactory),
    delayedEffect: (propertyFactory) => new DelayedEffectAction(propertyFactory), // when, message, gameAction, handler
    discardCard: (propertyFactory) => new DiscardCardAction(propertyFactory),
    discardFromPlay: (propertyFactory?) => new DiscardFromPlayAction(propertyFactory),
    discardStatusToken: (propertyFactory) => new DiscardStatusAction(propertyFactory),
    dishonor: (propertyFactory) => new DishonorAction(propertyFactory),
    duel: (propertyFactory) => new DuelAction(propertyFactory), // type, challenger, resolutionHandler, costHandler
    flipDynasty: (propertyFactory) => new FlipDynastyAction(propertyFactory),
    honor: (propertyFactory) => new HonorAction(propertyFactory),
    lookAt: (propertyFactory) => new LookAtAction(propertyFactory),
    moveCard: (propertyFactory) => new MoveCardAction(propertyFactory), // destination, switch = false, shuffle = false, faceup = false
    moveToConflict: (propertyFactory) => new MoveToConflictAction(propertyFactory),
    placeFate: (propertyFactory) => new PlaceFateAction(propertyFactory), // amount = 1, origin
    playCard: (propertyFactory) => new PlayCardAction(propertyFactory), // resetOnCancel = false, postHandler
    putIntoConflict: (propertyFactory) => new PutIntoPlayAction(propertyFactory), // fate = 0, status = ordinary
    putIntoPlay: (propertyFactory) => new PutIntoPlayAction(propertyFactory, false), // fate = 0, status = ordinary
    ready: (propertyFactory) => new ReadyAction(propertyFactory),
    removeFate: (propertyFactory) => new RemoveFateAction(propertyFactory), // amount = 1, recipient
    resolveAbility: (propertyFactory) => new ResolveAbilityAction(propertyFactory), // ability
    returnToDeck: (propertyFactory) => new ReturnToDeckAction(propertyFactory), // bottom = false
    returnToHand: (propertyFactory) => new ReturnToHandAction(propertyFactory),
    reveal: (propertyFactory) => new RevealAction(propertyFactory), // chatMessage = false
    sendHome: (propertyFactory) => new SendHomeAction(propertyFactory),
    sacrifice: (propertyFactory) => new DiscardFromPlayAction(propertyFactory, true),
    // player actions
    chosenDiscard: (propertyFactory) => new ChosenDiscardAction(propertyFactory), // amount = 1
    deckSearch: (propertyFactory) => new DeckSearchAction(propertyFactory), // amount = -1, reveal = true, cardCondition = (card, context) => true
    discardAtRandom: (propertyFactory) => new RandomDiscardAction(propertyFactory), // amount = 1
    draw: (propertyFactory) => new DrawAction(propertyFactory), // amount = 1
    gainFate: (propertyFactory) => new ModifyFateAction(propertyFactory), // amount = 1
    gainHonor: (propertyFactory) => new GainHonorAction(propertyFactory), // amount = 1
    initiateConflict: (propertyFactory) => new InitiateConflictAction(propertyFactory), // canPass = true
    loseHonor: (propertyFactory) => new LoseHonorAction(propertyFactory), // amount = 1
    loseImperialFavor: (propertyFactory) => new DiscardFavorAction(propertyFactory),
    modifyBid: (propertyFactory) => new ModifyBidAction(propertyFactory), // amount = 1, direction = 'increast', promptPlayer = false
    playerLastingEffect: (propertyFactory) => new LastingEffectAction(propertyFactory), // duration = 'untilEndOfConflict', effect, targetController, condition, until
    refillFaceup: (propertyFactory) => new RefillFaceupAction(propertyFactory), // location
    setHonorDial: (propertyFactory) => new SetDialAction(propertyFactory), // value
    takeFate: (propertyFactory) => new TransferFateAction(propertyFactory), // amount = 1
    takeHonor: (propertyFactory) => new TransferHonorAction(propertyFactory), // amount = 1
    // ring actions
    placeFateOnRing: (propertyFactory) => new PlaceFateRingAction(propertyFactory), // amount = 1, origin
    resolveConflictRing: (propertyFactory) => new ResolveConflictRingAction(propertyFactory), // resolveAsAttacker = true
    resolveRingEffect: (propertyFactory) => new ResolveElementAction(propertyFactory), // options = false
    returnRing: (propertyFactory) => new ReturnRingAction(propertyFactory),
    ringLastingEffect: (propertyFactory) => new LastingEffectRingAction(propertyFactory), // duration = 'untilEndOfConflict', effect, condition, until
    takeFateFromRing: (propertyFactory) => new TakeFateRingAction(propertyFactory), // amount = 1
    takeRing: (propertyFactory) => new TakeRingAction(propertyFactory),
    // meta actions
    chooseAction: (propertyFactory) => new ChooseGameAction(propertyFactory), // choices, activePromptTitle = 'Select one'
    jointAction: (gameActions) => new JointGameAction(gameActions), // takes an array of gameActions, not a propertyFactory
    sequentialAction: (gameActions) => new SequentialAction(gameActions) // takes an array of gameActions, not a propertyFactory
};

export = GameActions;
