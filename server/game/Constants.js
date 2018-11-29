const Locations = {
    Any: 'any',
    Hand: 'hand',
    ConflictDeck: 'conflict deck',
    DynastyDeck: 'dynasty deck',
    ConflictDiscardPile: 'conflict discard pile',
    DynastyDiscardPile: 'dynasty discard pile',
    PlayArea: 'play area',
    Provinces: 'province',
    ProvinceOne: 'province 1',
    ProvinceTwo: 'province 2',
    ProvinceThree: 'province 3',
    ProvinceFour: 'province 4',
    StrongholdProvince: 'stronghold province',
    ProvinceDeck: 'province deck',
    RemovedFromGame: 'removed from game',
    BeingPlayed: 'being played',
    Role: 'role'
};

const Decks = {
    ConflictDeck: 'conflict deck',
    DynastyDeck: 'dynasty deck'
};

const EffectNames = {
    AbilityRestrictions: 'abilityRestrictions',
    AddFaction: 'addFaction',
    AddGloryWhileDishonored: 'addGloryWhileDishonored',
    AddKeyword: 'addKeyword',
    AddTrait: 'addTrait',
    Blank: 'blank',
    CanBeSeenWhenFacedown: 'canBeSeenWhenFacedown',
    CannotBidInDuels: 'cannotBidInDuels',
    CannotHaveOtherRestrictedAttachments: 'cannotHaveOtherRestrictedAttachments',
    CannotParticipateAsAttacker: 'cannotParticipateAsAttacker',
    CannotParticipateAsDefender: 'cannotParticipateAsDefender',
    CustomEffect: 'customEffect',
    DelayedEffect: 'delayedEffect',
    DoesNotBow: 'doesNotBow',
    DoesNotReady: 'doesNotReady',
    GainAbility: 'gainAbility',
    GainPlayAction: 'gainPlayAction',
    IncreaseLimitOnAbilities: 'increaseLimitOnAbilities',
    ModifyBaseMilitarySkill: 'modifyBaseMilitarySkill',
    ModifyBasePoliticalSkill: 'modifyBasePoliticalSkill',
    ModifyBaseProvinceStrength: 'modifyBaseProvinceStrength',
    ModifyBothSkills: 'modifyBothSkills',
    ModifyDuelGlory: 'modifyDuelGlory',
    ModifyDuelMilitarySkill: 'modifyDuelMilitarySkill',
    ModifyDuelPoliticalSkill: 'modifyDuelPoliticalSkill',
    ModifyGlory: 'modifyGlory',
    ModifyMilitarySkill: 'modifyMilitarySkill',
    ModifyMilitarySkillMultiplier: 'modifyMilitarySkillMultiplier',
    ModifyPoliticalSkill: 'modifyPoliticalSkill',
    ModifyPoliticalSkillMultiplier: 'modifyPoliticalSkillMultiplier',
    ModifyProvinceStrength: 'modifyProvinceStrength',
    ModifyProvinceStrengthMultiplier: 'modifyProvinceStrengthMultiplier',
    SetBaseMilitarySkill: 'setBaseMilitarySkill',
    SetBasePoliticalSkill: 'setBasePoliticalSkill',
    SetBaseProvinceStrength: 'setBaseProvinceStrength',
    SetDash: 'setDash',
    SetGlory: 'setGlory',
    SetMilitarySkill: 'setMilitarySkill',
    SetPoliticalSkill: 'setPoliticalSkill',
    SetProvinceStrength: 'setProvinceStrength',
    TakeControl: 'takeControl',
    TerminalCondition: 'terminalCondition',
    AddElement: 'addElement',
    CannotDeclareRing: 'cannotDeclare',
    ConsiderRingAsClaimed: 'considerAsClaimed',
    AdditionalCharactersInConflict: 'additionalCharactersInConflict',
    AdditionalConflict: 'additionalConflict',
    AlternateFatePool: 'alternateFatePool',
    CanPlayFromOwn: 'canPlayFromOwn',
    ChangePlayerGloryModifier: 'gloryModifier',
    ChangePlayerSkillModifier: 'conflictSkillModifier',
    GainActionPhasePriority: 'actionPhasePriority',
    CostReducer:'costReducer',
    SetMaxConflicts: 'maxConflicts',
    ShowTopConflictCard: 'showTopConflictCard',
    ContributeToConflict: 'contribute',
    ChangeConflictSkillFunction: 'skillFunction',
    ModifyConflictElementsToResolve: 'modifyConflictElementsToResolve',
    RestrictNumberOfDefenders: 'restrictNumberOfDefenders'
};

const Durations = {
    UntilEndOfDuel: 'untilEndOfDuel',
    UntilEndOfConflict: 'untilEndOfConflict',
    UntilEndOfPhase: 'untilEndOfPhase',
    UntilEndOfRound: 'untilEndOfRound',
    Persistent: 'persistent',
    Custom: 'custom'
};

const Stages = {
    Cost: 'cost',
    Effect: 'effect',
    PreTarget: 'pretarget',
    Target: 'target'
};

const Players = {
    Self: 'self',
    Opponent: 'opponent',
    Any: 'any'
};

const TargetModes = {
    Ring: 'ring',
    Select: 'select',
    Ability: 'ability',
    Exactly: 'exactly',
    MaxStat: 'maxStat',
    Single: 'single',
    Unlimited: 'unlimited',
    UpTo: 'upTo'
};

const Phases = {
    Dynasty: 'dynasty',
    Draw: 'draw',
    Conflict: 'conflict',
    Fate: 'fate',
    Regroup: 'regroup'
};

const CardTypes = {
    Stronghold: 'stronghold',
    Role: 'role',
    Province: 'province',
    Character: 'character',
    Holding: 'holding',
    Event: 'event',
    Attachment: 'attachment'
};

const PlayTypes = {
    PlayFromHand: 'playFromHand',
    PlayFromProvince: 'playFromProvince'
};

module.exports = {
    Locations,
    Decks,
    EffectNames,
    Durations,
    Stages,
    Players,
    TargetModes,
    Phases,
    CardTypes,
    PlayTypes
};
