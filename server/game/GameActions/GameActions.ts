import AbilityContext = require('../AbilityContext');
import { GameAction } from './GameAction';
import { AttachAction, AttachActionProperties } from './AttachAction';
import { BowAction, BowActionProperties } from './BowAction';
import { BreakAction, BreakProperties } from './BreakAction';
import { CardMenuAction, CardMenuProperties } from './CardMenuAction';
import { ChooseGameAction, ChooseActionProperties } from './ChooseGameAction';
import { ChosenDiscardAction, ChosenDiscardProperties } from './ChosenDiscardAction';
import { CreateTokenAction, CreateTokenProperties } from './CreateTokenAction';
import { DeckSearchAction,  DeckSearchProperties} from './DeckSearchAction';
import { DelayedEffectAction, DelayedEffectActionProperties } from './DelayedEffectAction';
import { DiscardFavorAction, DiscardFavorProperties } from './DiscardFavorAction';
import { DiscardFromPlayAction, DiscardFromPlayProperties } from './DiscardFromPlayAction';
import { DiscardCardAction, DiscardCardProperties } from './DiscardCardAction';
import { DiscardStatusAction, DiscardStatusProperties } from './DiscardStatusAction';
import { DishonorAction, DishonorProperties } from './DishonorAction';
import { DrawAction, DrawProperties } from './DrawAction';
import { DuelAction, DuelProperties } from './DuelAction';
import { FlipDynastyAction, FlipDynastyProperties } from './FlipDynastyAction';
import { GainFateAction, GainFateProperties } from './GainFateAction';
import { GainHonorAction, GainHonorProperties } from './GainHonorAction';
import { HonorAction, HonorProperties } from './HonorAction';
import { InitiateConflictAction, InitiateConflictProperties } from './InitiateConflictAction';
import { JointGameAction } from './JointGameAction';
import { LastingEffectAction, LastingEffectProperties } from './LastingEffectAction';
import { LastingEffectCardAction, LastingEffectCardProperties } from './LastingEffectCardAction';
import { LastingEffectRingAction, LastingEffectRingProperties } from './LastingEffectRingAction';
import { LookAtAction, LookAtProperties } from './LookAtAction';
import { LoseHonorAction, LoseHonorProperties } from './LoseHonorAction';
import { MenuPromptAction, MenuPromptProperties } from './MenuPromptAction';
import { ModifyBidAction, ModifyBidProperties } from './ModifyBidAction';
import { MoveCardAction, MoveCardProperties } from './MoveCardAction';
import { MoveToConflictAction, MoveToConflictProperties } from './MoveToConflictAction';
import { PlaceFateAction, PlaceFateProperties } from './PlaceFateAction';
import { PlaceFateRingAction, PlaceFateRingProperties } from './PlaceFateRingAction';
import { PlayCardAction, PlayCardProperties } from './PlayCardAction';
import { PutIntoPlayAction, PutIntoPlayProperties } from './PutIntoPlayAction';
import { RandomDiscardAction, RandomDiscardProperties } from './RandomDiscardAction';
import { ReadyAction, ReadyProperties } from './ReadyAction';
import { RefillFaceupAction, RefillFaceupProperties } from './RefillFaceupAction';
import { RemoveFateAction, RemoveFateProperties } from './RemoveFateAction';
import { ResolveAbilityAction, ResolveAbilityProperties } from './ResolveAbilityAction';
import { ResolveConflictRingAction, ResolveConflictRingProperties } from './ResolveConflictRingAction';
import { ResolveElementAction, ResolveElementProperties } from './ResolveElementAction';
import { ReturnRingAction, ReturnRingProperties } from './ReturnRingAction';
import { ReturnToDeckAction, ReturnToDeckProperties } from './ReturnToDeckAction';
import { ReturnToHandAction, ReturnToHandProperties } from './ReturnToHandAction';
import { RevealAction, RevealProperties } from './RevealAction';
import { SelectCardAction, SelectCardProperties } from './SelectCardAction';
import { SendHomeAction, SendHomeProperties } from './SendHomeAction';
import { SequentialAction } from './SequentialAction';
import { SetDialAction, SetDialProperties } from './SetDialAction';
import { TakeFateRingAction, TakeFateRingProperties } from './TakeFateRingAction';
import { TakeRingAction, TakeRingProperties } from './TakeRingAction';
import { TransferFateAction, TransferFateProperties } from './TransferFateAction';
import { TransferHonorAction, TransferHonorProperties } from './TransferHonorAction';
import { LoseFateProperties, LoseFateAction } from './LoseFateActions';

const GameActions = {
    // card actions
    attach: (propertyFactory: AttachActionProperties | ((context: AbilityContext) => AttachActionProperties) = {}) => new AttachAction(propertyFactory), // attachment
    bow: (propertyFactory: BowActionProperties | ((context: AbilityContext) => BowActionProperties) = {}) => new BowAction(propertyFactory),
    break: (propertyFactory: BreakProperties | ((context: AbilityContext) => BreakProperties) = {}) => new BreakAction(propertyFactory),
    cardLastingEffect: (propertyFactory: LastingEffectCardProperties | ((context: AbilityContext) => LastingEffectCardProperties)) => new LastingEffectCardAction(propertyFactory),
    createToken: (propertyFactory: CreateTokenProperties | ((context: AbilityContext) => CreateTokenProperties) = {}) => new CreateTokenAction(propertyFactory),
    delayedEffect: (propertyFactory: DelayedEffectActionProperties | ((context: AbilityContext) => DelayedEffectActionProperties)) => new DelayedEffectAction(propertyFactory), // when, message, gameAction, handler
    discardCard: (propertyFactory: DiscardCardProperties | ((context: AbilityContext) => DiscardCardProperties) = {}) => new DiscardCardAction(propertyFactory),
    discardFromPlay: (propertyFactory: DiscardFromPlayProperties | ((context: AbilityContext) => DiscardFromPlayProperties) = {}) => new DiscardFromPlayAction(propertyFactory),
    discardStatusToken: (propertyFactory: DiscardStatusProperties | ((context: AbilityContext) => DiscardStatusProperties) = {}) => new DiscardStatusAction(propertyFactory),
    dishonor: (propertyFactory: DishonorProperties | ((context: AbilityContext) => DishonorProperties) = {}) => new DishonorAction(propertyFactory),
    duel: (propertyFactory: DuelProperties | ((context: AbilityContext) => DuelProperties)) => new DuelAction(propertyFactory), // type, challenger, resolutionHandler, costHandler
    flipDynasty: (propertyFactory: FlipDynastyProperties | ((context: AbilityContext) => FlipDynastyProperties) = {}) => new FlipDynastyAction(propertyFactory),
    honor: (propertyFactory: HonorProperties | ((context: AbilityContext) => HonorProperties) = {}) => new HonorAction(propertyFactory),
    lookAt: (propertyFactory: LookAtProperties | ((context: AbilityContext) => LookAtProperties) = {}) => new LookAtAction(propertyFactory),
    moveCard: (propertyFactory: MoveCardProperties | ((context: AbilityContext) => MoveCardProperties)) => new MoveCardAction(propertyFactory), // destination, switch = false, shuffle = false, faceup = false
    moveToConflict: (propertyFactory: MoveToConflictProperties | ((context: AbilityContext) => MoveToConflictProperties) = {}) => new MoveToConflictAction(propertyFactory),
    placeFate: (propertyFactory: PlaceFateProperties | ((context: AbilityContext) => PlaceFateProperties) = {}) => new PlaceFateAction(propertyFactory), // amount = 1, origin
    playCard: (propertyFactory: PlayCardProperties | ((context: AbilityContext) => PlayCardProperties)) => new PlayCardAction(propertyFactory), // resetOnCancel = false, postHandler
    putIntoConflict: (propertyFactory: PutIntoPlayProperties | ((context: AbilityContext) => PutIntoPlayProperties) = {}) => new PutIntoPlayAction(propertyFactory), // fate = 0, status = ordinary
    putIntoPlay: (propertyFactory: PutIntoPlayProperties | ((context: AbilityContext) => PutIntoPlayProperties) = {}) => new PutIntoPlayAction(propertyFactory, false), // fate = 0, status = ordinary
    ready: (propertyFactory: ReadyProperties | ((context: AbilityContext) => ReadyProperties) = {}) => new ReadyAction(propertyFactory),
    removeFate: (propertyFactory: RemoveFateProperties | ((context: AbilityContext) => RemoveFateProperties) = {}) => new RemoveFateAction(propertyFactory), // amount = 1, recipient
    resolveAbility: (propertyFactory: ResolveAbilityProperties | ((context: AbilityContext) => ResolveAbilityProperties)) => new ResolveAbilityAction(propertyFactory), // ability
    returnToDeck: (propertyFactory: ReturnToDeckProperties | ((context: AbilityContext) => ReturnToDeckProperties) = {}) => new ReturnToDeckAction(propertyFactory), // bottom = false
    returnToHand: (propertyFactory: ReturnToHandProperties | ((context: AbilityContext) => ReturnToHandProperties) = {}) => new ReturnToHandAction(propertyFactory),
    reveal: (propertyFactory: RevealProperties | ((context: AbilityContext) => RevealProperties) = {}) => new RevealAction(propertyFactory), // chatMessage = false
    sendHome: (propertyFactory: SendHomeProperties | ((context: AbilityContext) => SendHomeProperties) = {}) => new SendHomeAction(propertyFactory),
    sacrifice: (propertyFactory: DiscardFromPlayProperties | ((context: AbilityContext) => DiscardFromPlayProperties) = {}) => new DiscardFromPlayAction(propertyFactory, true),
    // player actions
    chosenDiscard: (propertyFactory: ChosenDiscardProperties | ((context: AbilityContext) => ChosenDiscardProperties) = {}) => new ChosenDiscardAction(propertyFactory), // amount = 1
    deckSearch: (propertyFactory: DeckSearchProperties | ((context: AbilityContext) => DeckSearchProperties)) => new DeckSearchAction(propertyFactory), // amount = -1, reveal = true, cardCondition = (card, context) => true
    discardAtRandom: (propertyFactory: RandomDiscardProperties | ((context: AbilityContext) => RandomDiscardProperties) = {}) => new RandomDiscardAction(propertyFactory), // amount = 1
    draw: (propertyFactory: DrawProperties | ((context: AbilityContext) => DrawProperties)) => new DrawAction(propertyFactory), // amount = 1
    gainFate: (propertyFactory: GainFateProperties | ((context: AbilityContext) => GainFateProperties) = {}) => new GainFateAction(propertyFactory), // amount = 1
    gainHonor: (propertyFactory: GainHonorProperties | ((context: AbilityContext) => GainHonorProperties) = {}) => new GainHonorAction(propertyFactory), // amount = 1
    initiateConflict: (propertyFactory: InitiateConflictProperties | ((context: AbilityContext) => InitiateConflictProperties) = {}) => new InitiateConflictAction(propertyFactory), // canPass = true
    loseFate: (propertyFactory: LoseFateProperties | ((context: AbilityContext) => LoseFateProperties) = {}) => new LoseFateAction(propertyFactory),
    loseHonor: (propertyFactory: LoseHonorProperties | ((context: AbilityContext) => LoseHonorProperties) = {}) => new LoseHonorAction(propertyFactory), // amount = 1
    loseImperialFavor: (propertyFactory: DiscardFavorProperties | ((context: AbilityContext) => DiscardFavorProperties) = {}) => new DiscardFavorAction(propertyFactory),
    modifyBid: (propertyFactory: ModifyBidProperties | ((context: AbilityContext) => ModifyBidProperties) = {}) => new ModifyBidAction(propertyFactory), // amount = 1, direction = 'increast', promptPlayer = false
    playerLastingEffect: (propertyFactory: LastingEffectProperties | ((context: AbilityContext) => LastingEffectProperties) ) => new LastingEffectAction(propertyFactory), // duration = 'untilEndOfConflict', effect, targetController, condition, until
    refillFaceup: (propertyFactory: RefillFaceupProperties | ((context: AbilityContext) => RefillFaceupProperties)) => new RefillFaceupAction(propertyFactory), // location
    setHonorDial: (propertyFactory: SetDialProperties | ((context: AbilityContext) => SetDialProperties)) => new SetDialAction(propertyFactory), // value
    takeFate: (propertyFactory: TransferFateProperties | ((context: AbilityContext) => TransferFateProperties) = {}) => new TransferFateAction(propertyFactory), // amount = 1
    takeHonor: (propertyFactory: TransferHonorProperties | ((context: AbilityContext) => TransferHonorProperties) = {}) => new TransferHonorAction(propertyFactory), // amount = 1
    // ring actions
    placeFateOnRing: (propertyFactory: PlaceFateRingProperties | ((context: AbilityContext) => PlaceFateRingProperties) = {}) => new PlaceFateRingAction(propertyFactory), // amount = 1, origin
    resolveConflictRing: (propertyFactory: ResolveConflictRingProperties | ((context: AbilityContext) => ResolveConflictRingProperties) = {}) => new ResolveConflictRingAction(propertyFactory), // resolveAsAttacker = true
    resolveRingEffect: (propertyFactory: ResolveElementProperties | ((context: AbilityContext) => ResolveElementProperties) = {}) => new ResolveElementAction(propertyFactory), // options = false
    returnRing: (propertyFactory: ReturnRingProperties | ((context: AbilityContext) => ReturnRingProperties) = {}) => new ReturnRingAction(propertyFactory),
    ringLastingEffect: (propertyFactory: LastingEffectRingProperties | ((context: AbilityContext) => LastingEffectRingProperties)) => new LastingEffectRingAction(propertyFactory), // duration = 'untilEndOfConflict', effect, condition, until
    takeFateFromRing: (propertyFactory: TakeFateRingProperties | ((context: AbilityContext) => TakeFateRingProperties) = {}) => new TakeFateRingAction(propertyFactory), // amount = 1
    takeRing: (propertyFactory: TakeRingProperties | ((context: AbilityContext) => TakeRingProperties) = {}) => new TakeRingAction(propertyFactory),
    // meta actions
    cardMenu: (propertyFactory: CardMenuProperties | ((context: AbilityContext) => CardMenuProperties)) => new CardMenuAction(propertyFactory),
    chooseAction: (propertyFactory: ChooseActionProperties | ((context: AbilityContext) => ChooseActionProperties)) => new ChooseGameAction(propertyFactory), // choices, activePromptTitle = 'Select one'
    jointAction: (gameActions: GameAction[]) => new JointGameAction(gameActions), // takes an array of gameActions, not a propertyFactory
    menuPrompt: (propertyFactory: MenuPromptProperties | ((context: AbilityContext) => MenuPromptProperties)) => new MenuPromptAction(propertyFactory),
    selectCard: (propertyFactory: SelectCardProperties | ((context: AbilityContext) => SelectCardProperties)) => new SelectCardAction(propertyFactory),
    sequentialAction: (gameActions: GameAction[]) => new SequentialAction(gameActions) // takes an array of gameActions, not a propertyFactory
};

export = GameActions;
