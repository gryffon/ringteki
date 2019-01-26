const _ = require('underscore');

const AbilityLimit = require('./abilitylimit.js');
const CopyCharacter = require('./Effects/CopyCharacter');
const Restriction = require('./Effects/restriction.js');
const GainAbility = require('./Effects/GainAbility');
const EffectBuilder = require('./Effects/EffectBuilder');
const { EffectNames, PlayTypes } = require('./Constants');

/* Types of effect
    1. Static effects - do something for a period
    2. Dynamic effects - like static, but what they do depends on the game state
    3. Detached effects - do something when applied, and on expiration, but can be ignored in the interim
*/

const Effects = {
    // Card effects
    addFaction: (faction) => EffectBuilder.card.static(EffectNames.AddFaction, faction),
    addGloryToBothSkills: () => EffectBuilder.card.static(EffectNames.AddGloryToBothSkills),
    addKeyword: (keyword) => EffectBuilder.card.static(EffectNames.AddKeyword, keyword),
    addTrait: (trait) => EffectBuilder.card.static(EffectNames.AddTrait, trait),
    blank: () => EffectBuilder.card.static(EffectNames.Blank),
    canBeSeenWhenFacedown: () => EffectBuilder.card.static(EffectNames.CanBeSeenWhenFacedown),
    cannotHaveOtherRestrictedAttachments: card => EffectBuilder.card.static(EffectNames.CannotHaveOtherRestrictedAttachments, card),
    cannotParticipateAsAttacker: (type = 'both') => EffectBuilder.card.static(EffectNames.CannotParticipateAsAttacker, type),
    cannotParticipateAsDefender: (type = 'both') => EffectBuilder.card.static(EffectNames.CannotParticipateAsDefender, type),
    cardCannot: (properties) => EffectBuilder.card.static(EffectNames.AbilityRestrictions, new Restriction(Object.assign({ type: properties.cannot || properties }, properties))),
    copyCharacter: (character) => EffectBuilder.card.static(EffectNames.CopyCharacter, new CopyCharacter(character)),
    customDetachedCard: (properties) => EffectBuilder.card.detached(EffectNames.CustomEffect, properties),
    delayedEffect: (properties) => EffectBuilder.card.detached(EffectNames.DelayedEffect, {
        apply: (card, context) => {
            properties.target = card;
            properties.context = properties.context || context;
            return context.source.delayedEffect(() => properties);
        },
        unapply: (card, context, effect) => context.game.effectEngine.removeDelayedEffect(effect)
    }),
    doesNotBow: () => EffectBuilder.card.static(EffectNames.DoesNotBow),
    doesNotReady: () => EffectBuilder.card.static(EffectNames.DoesNotReady),
    gainAbility: (abilityType, properties) => EffectBuilder.card.static(EffectNames.GainAbility, new GainAbility(abilityType, properties)),
    gainPlayAction: (playActionClass) => EffectBuilder.card.detached(EffectNames.GainPlayAction, {
        apply: card => {
            let action = new playActionClass(card);
            card.abilities.playActions.push(action);
            return action;
        },
        unapply: (card, context, playAction) => card.abilities.playActions = card.abilities.playActions.filter(action => action !== playAction)
    }),
    hideWhenFaceUp: () => EffectBuilder.card.static(EffectNames.HideWhenFaceUp),
    honorStatusDoesNotAffectLeavePlay: () => EffectBuilder.card.flexible(EffectNames.HonorStatusDoesNotAffectLeavePlay),
    honorStatusDoesNotModifySkill: () => EffectBuilder.card.flexible(EffectNames.HonorStatusDoesNotModifySkill),
    honorStatusReverseModifySkill: () => EffectBuilder.card.flexible(EffectNames.HonorStatusReverseModifySkill),
    immunity: (properties) => EffectBuilder.card.static(EffectNames.AbilityRestrictions, new Restriction(properties)),
    increaseLimitOnAbilities: (abilities) => EffectBuilder.card.static(EffectNames.IncreaseLimitOnAbilities, abilities),
    modifyBaseMilitarySkill: (value) => EffectBuilder.card.flexible(EffectNames.ModifyBaseMilitarySkill, value),
    modifyBasePoliticalSkill: (value) => EffectBuilder.card.flexible(EffectNames.ModifyBasePoliticalSkill, value),
    modifyBaseProvinceStrength: (value) => EffectBuilder.card.flexible(EffectNames.ModifyBaseProvinceStrength, value),
    modifyBothSkills: (value) => EffectBuilder.card.flexible(EffectNames.ModifyBothSkills, value),
    modifyDuelGlory: (value) => EffectBuilder.card.static(EffectNames.ModifyDuelGlory, value),
    modifyDuelMilitarySkill: (value) => EffectBuilder.card.static(EffectNames.ModifyDuelMilitarySkill, value),
    modifyDuelPoliticalSkill: (value) => EffectBuilder.card.static(EffectNames.ModifyDuelPoliticalSkill, value),
    modifyGlory: (value) => EffectBuilder.card.flexible(EffectNames.ModifyGlory, value),
    modifyMilitarySkill: (value) => EffectBuilder.card.flexible(EffectNames.ModifyMilitarySkill, value),
    modifyMilitarySkillMultiplier: (value) => EffectBuilder.card.flexible(EffectNames.ModifyMilitarySkillMultiplier, value),
    modifyPoliticalSkill: (value) => EffectBuilder.card.flexible(EffectNames.ModifyPoliticalSkill, value),
    modifyPoliticalSkillMultiplier: (value) => EffectBuilder.card.flexible(EffectNames.ModifyPoliticalSkillMultiplier, value),
    modifyProvinceStrength: (value) => EffectBuilder.card.flexible(EffectNames.ModifyProvinceStrength, value),
    modifyProvinceStrengthMultiplier: (value) => EffectBuilder.card.flexible(EffectNames.ModifyProvinceStrengthMultiplier, value),
    mustBeChosen: (properties) => EffectBuilder.card.static(EffectNames.MustBeChosen, new Restriction(Object.assign({ type: 'target' }, properties))),
    setBaseMilitarySkill: (value) => EffectBuilder.card.static(EffectNames.SetBaseMilitarySkill, value),
    setBasePoliticalSkill: (value) => EffectBuilder.card.static(EffectNames.SetBasePoliticalSkill, value),
    setBaseProvinceStrength: (value) => EffectBuilder.card.static(EffectNames.SetBaseProvinceStrength, value),
    setDash: (type) => EffectBuilder.card.static(EffectNames.SetDash, type),
    setGlory: (value) => EffectBuilder.card.static(EffectNames.SetGlory, value),
    setMilitarySkill: (value) => EffectBuilder.card.static(EffectNames.SetMilitarySkill, value),
    setPoliticalSkill: (value) => EffectBuilder.card.static(EffectNames.SetPoliticalSkill, value),
    setProvinceStrength: (value) => EffectBuilder.card.static(EffectNames.SetProvinceStrength, value),
    takeControl: (player) => EffectBuilder.card.static(EffectNames.TakeControl, player),
    terminalCondition: (properties) => EffectBuilder.card.detached(EffectNames.TerminalCondition, {
        apply: (card, context) => {
            properties.target = card;
            properties.context = properties.context || context;
            return context.source.terminalCondition(() => properties);
        },
        unapply: (card, context, effect) => context.game.effectEngine.removeTerminalCondition(effect)
    }),
    // Ring effects
    addElement: (element) => EffectBuilder.ring.static(EffectNames.AddElement, element),
    cannotBidInDuels: num => EffectBuilder.player.static(EffectNames.CannotBidInDuels, num),
    cannotDeclareRing: (match) => EffectBuilder.ring.static(EffectNames.CannotDeclareRing, match), // TODO: Add this to lasting effect checks
    considerRingAsClaimed: (match) => EffectBuilder.ring.static(EffectNames.ConsiderRingAsClaimed, match), // TODO: Add this to lasting effect checks
    // Player effects
    additionalCharactersInConflict: (amount) => EffectBuilder.player.flexible(EffectNames.AdditionalCharactersInConflict, amount),
    additionalConflict: (type) => EffectBuilder.player.detached(EffectNames.AdditionalConflict, {
        apply: player => player.addConflictOpportunity(type),
        unapply: () => true
    }),
    alternateFatePool: (match) => EffectBuilder.player.static(EffectNames.AlternateFatePool, match),
    canPlayFromOwn: (location, cards) => EffectBuilder.player.detached(EffectNames.CanPlayFromOwn, {
        apply: (player) => player.addPlayableLocation(PlayTypes.PlayFromHand, player, location, cards),
        unapply: (player, context, location) => player.removePlayableLocation(location)
    }),
    changePlayerGloryModifier: (value) => EffectBuilder.player.static(EffectNames.ChangePlayerGloryModifier, value),
    changePlayerSkillModifier: (value) => EffectBuilder.player.flexible(EffectNames.ChangePlayerSkillModifier, value),
    customDetachedPlayer: (properties) => EffectBuilder.player.detached(EffectNames.CustomEffect, properties),
    gainActionPhasePriority: () => EffectBuilder.player.detached(EffectNames.GainActionPhasePriority, {
        apply: player => player.actionPhasePriority = true,
        unapply: player => player.actionPhasePriority = false
    }),
    increaseCost: (properties) => Effects.reduceCost(_.extend(properties, { amount: -properties.amount })),
    playerCannot: (properties) => EffectBuilder.player.static(EffectNames.AbilityRestrictions, new Restriction(Object.assign({ type: properties.cannot || properties }, properties))),
    reduceCost: (properties) => EffectBuilder.player.detached(EffectNames.CostReducer, {
        apply: (player, context) => player.addCostReducer(context.source, properties),
        unapply: (player, context, reducer) => player.removeCostReducer(reducer)
    }),
    reduceNextPlayedCardCost: (amount, match) => EffectBuilder.player.detached(EffectNames.CostReducer, {
        apply: (player, context) => player.addCostReducer(context.source, { amount: amount, match: match, limit: AbilityLimit.fixed(1) }),
        unapply: (player, context, reducer) => player.removeCostReducer(reducer)
    }),
    setMaxConflicts: (amount) => EffectBuilder.player.static(EffectNames.SetMaxConflicts, amount),
    showTopConflictCard: () => EffectBuilder.player.static(EffectNames.ShowTopConflictCard),
    // Conflict effects
    contributeToConflict: (card) => EffectBuilder.conflict.flexible(EffectNames.ContributeToConflict, card),
    changeConflictSkillFunction: (func) => EffectBuilder.conflict.static(EffectNames.ChangeConflictSkillFunction, func), // TODO: Add this to lasting effect checks
    modifyConflictElementsToResolve: (value) => EffectBuilder.conflict.static(EffectNames.ModifyConflictElementsToResolve, value), // TODO: Add this to lasting effect checks
    restrictNumberOfDefenders: (value) => EffectBuilder.conflict.static(EffectNames.RestrictNumberOfDefenders, value) // TODO: Add this to lasting effect checks
};

module.exports = Effects;
