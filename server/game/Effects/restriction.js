const EffectValue = require('./EffectValue');

const { AbilityTypes, CardTypes } = require('../Constants');

const checkRestrictions = {
    abilitiesTriggeredByOpponents: (context, effect) =>
        context.player === effect.context.player.opponent && context.ability.isTriggeredAbility() && context.ability.abilityType !== AbilityTypes.ForcedReaction && context.ability.abilityType !== AbilityTypes.ForcedInterrupt,
    attachmentsWithSameClan: (context, effect, card) =>
        context.source.type === CardTypes.Attachment &&
        context.source.getPrintedFaction() !== 'neutral' && card.isFaction(context.source.getPrintedFaction()),
    characters: context => context.source.type === CardTypes.Character,
    copiesOfDiscardEvents: context =>
        context.source.type === CardTypes.Event && context.player.conflictDiscardPile.any(card => card.name === context.source.name),
    copiesOfX: (context, effect) => context.source.name === effect.params,
    events: context => context.source.type === CardTypes.Event,
    eventsWithSameClan: (context, effect, card) =>
        context.source.type === CardTypes.Event &&
        context.source.getPrintedFaction() !== 'neutral' && card.isFaction(context.source.getPrintedFaction()),
    nonSpellEvents: context => context.source.type === CardTypes.Event && !context.source.hasTrait('spell'),
    opponentsCardEffects: (context, effect) =>
        context.player === effect.context.player.opponent && (context.ability.isCardAbility() || !context.ability.isCardPlayed()) &&
        [CardTypes.Event, CardTypes.Character, CardTypes.Holding, CardTypes.Attachment, CardTypes.Stronghold, CardTypes.Province, CardTypes.Role].includes(context.source.type),
    opponentsEvents: (context, effect) =>
        context.player && context.player === effect.context.player.opponent && context.source.type === CardTypes.Event,
    opponentsRingEffects: (context, effect) =>
        context.player && context.player === effect.context.player.opponent && context.source.type === 'ring',
    opponentsTriggeredAbilities: (context, effect) =>
        context.player === effect.context.player.opponent && context.ability.isTriggeredAbility(),
    opponentsCardAbilities: (context, effect) =>
        context.player === effect.context.player.opponent && context.ability.isCardAbility(),
    reactions: context => context.ability.abilityType === AbilityTypes.Reaction,
    source: (context, effect) => context.source === effect.context.source,
    keywordAbilities: context => context.ability.isKeywordAbility(),
    nonKeywordAbilities: context => !context.ability.isKeywordAbility(),
    nonForcedAbilities: context => context.ability.isTriggeredAbility() && context.ability.abilityType !== AbilityTypes.ForcedReaction && context.ability.abilityType !== AbilityTypes.ForcedInterrupt,
    equalOrMoreExpensiveCharacterTriggeredAbilities: (context, effect, card) => context.source.type === CardTypes.Character && !context.ability.isKeywordAbility && context.source.printedCost >= card.printedCost,
    equalOrMoreExpensiveCharacterKeywords: (context, effect, card) => context.source.type === CardTypes.Character && context.ability.isKeywordAbility && context.source.printedCost >= card.printedCost
};

const leavePlayTypes = [
    'discardFromPlay',
    'sacrifice',
    'returnToHand',
    'returnToDeck',
    'removeFromGame'
];

class Restriction extends EffectValue {
    constructor(properties) {
        super();
        if(typeof properties === 'string') {
            this.type = properties;
        } else {
            this.type = properties.type;
            this.restriction = properties.restricts;
            this.params = properties.params;
        }
    }

    // @ts-ignore
    getValue() {
        return this;
    }

    isMatch(type, context, card) {
        if(this.type === 'leavePlay') {
            return leavePlayTypes.includes(type) && this.checkCondition(context, card);
        }
        return (!this.type || this.type === type) && this.checkCondition(context, card);
    }

    checkCondition(context, card) {
        if(!this.restriction) {
            return true;
        } else if(!context) {
            throw new Error('checkCondition called without a context');
        } else if(!checkRestrictions[this.restriction]) {
            return context.source.hasTrait(this.restriction);
        }
        return checkRestrictions[this.restriction](context, this, card);
    }
}

module.exports = Restriction;
