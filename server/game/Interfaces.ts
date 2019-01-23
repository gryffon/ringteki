import AbilityContext = require('./AbilityContext');
import TriggeredAbilityContext = require('./TriggeredAbilityContext');
import { GameAction } from './GameActions/GameAction';
import Ring = require('./ring');
import BaseCard = require('./basecard');
import CardAbility = require('./CardAbility');
import { Players, TargetModes, CardTypes, Locations, EventNames, Durations } from './Constants';

interface BaseTarget {
    activePromptTitle?: string;
    player?: ((context: AbilityContext) => Players) | Players;
    gameAction?: GameAction | GameAction[];
};

interface ChoicesInterface {
    [propName: string]: ((context: AbilityContext) => boolean) | GameAction | GameAction[];
};

interface TargetSelect extends BaseTarget {
    mode: TargetModes.Select;
    choices: ChoicesInterface;
};

interface TargetRing extends BaseTarget {
    mode: TargetModes.Ring;
    ringCondition: (ring: Ring, context?: AbilityContext) => boolean;
};

interface TargetAbility extends BaseTarget {
    mode: TargetModes.Ability;
    cardType?: CardTypes | CardTypes[];
    cardCondition?: (card: BaseCard, context?: AbilityContext) => boolean;
    abilityCondition?: (ability: CardAbility) => boolean;
};

interface BaseTargetCard extends BaseTarget {
    cardType?: CardTypes | CardTypes[];
    controller?: Players;
    location?: Locations | Locations[];
    optional?: boolean;
};

interface TargetCardExactlyUpTo extends BaseTargetCard {
    mode: TargetModes.Exactly | TargetModes.UpTo,
    numCards: number;
};

interface TargetCardMaxStat extends BaseTargetCard {
    mode: TargetModes.MaxStat,
    numCards: number;
    cardStat: (card: BaseCard) => number;
    maxStat: () => number;
};

interface TargetCardSingleUnlimited extends BaseTargetCard {
    mode?: TargetModes.Single | TargetModes.Unlimited;
};

type TargetCard = TargetCardExactlyUpTo | TargetCardMaxStat | TargetCardSingleUnlimited | TargetAbility;

interface SubTarget {
    dependsOn?: string;
};

interface ActionCardTarget {
    cardCondition?: (card: BaseCard, context?: AbilityContext) => boolean;
};

interface ActionRingTarget {
    ringCondition?: (ring: Ring, context?: AbilityContext) => boolean;
};

type ActionTarget = (TargetCard & ActionCardTarget) | (TargetRing & ActionRingTarget) | TargetSelect | TargetAbility;

interface ActionTargets {
    [propName: string]: ActionTarget & SubTarget;
};

interface InitiateDuel {
    type: string;
    resolutionHandler: (winner: BaseCard) => void
};

interface AbilityProps {
    title: string;
    location?: Locations | Locations[];
    cost?: any;
    limit?: any;
    max?: any;
    target?: ActionTarget;
    targets?: ActionTargets;
    initiateDuel?: InitiateDuel | ((context: AbilityContext) => InitiateDuel);
    cannotBeMirrored?: boolean;
    printedAbility?: boolean;
    cannotTargetFirst?: boolean;
    effect?: string;
    effectArgs?: any;
    gameAction?: GameAction | GameAction[];
    handler?: (context?: AbilityContext) => void;
    then?: ((context?: AbilityContext) => object) | object;
};

export interface ActionProps extends AbilityProps {
    condition?: (context?: AbilityContext) => boolean;
    phase?: string;
};

interface TriggeredAbilityCardTarget {
    cardCondition?: (card: BaseCard, context?: TriggeredAbilityContext) => boolean;
};

interface TriggeredAbilityRingTarget {
    ringCondition?: (ring: Ring, context?: TriggeredAbilityContext) => boolean;
};

type TriggeredAbilityTarget = (TargetCard & TriggeredAbilityCardTarget) | (TargetRing & TriggeredAbilityRingTarget) | TargetSelect;

interface TriggeredAbilityTargets {
    [propName: string]: TriggeredAbilityTarget & SubTarget & TriggeredAbilityTarget;
};

export type WhenType = {
    [EventName in EventNames]?: (event: any, context?: TriggeredAbilityContext) => boolean;
};

export interface TriggeredAbilityProps extends AbilityProps {
    when: WhenType;
    collectiveTrigger?: boolean;
    target?: TriggeredAbilityTarget & TriggeredAbilityTarget;
    targets?: TriggeredAbilityTargets;
    handler?: (context: TriggeredAbilityContext) => void;
    then?: ((context?: TriggeredAbilityContext) => object) | object;
};

export interface PersistentEffectProps {
    location?: Locations | Locations[];
    duration?: Durations;
    condition?: (context: AbilityContext) => boolean;
    match?: (card: BaseCard, context?: AbilityContext) => boolean;
    targetController?: Players;
    targetLocation?: Locations;
    effect: Function | Function[];
};
