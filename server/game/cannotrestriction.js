const { CardTypes } = require('./Constants');

const checkRestrictions = {
    characters: context => context.source.type === CardTypes.Character,
    copiesOfDiscardEvents: context =>
        context.source.type === CardTypes.Event && context.player.conflictDiscardPile.any(card => card.name === context.source.name),
    copiesOfX: (context, player, source, params) => context.source.name === params,
    events: context => context.source.type === CardTypes.Event,
    nonSpellEvents: context => context.source.type === CardTypes.Event && !context.source.hasTrait('spell'),
    opponentsCardEffects: (context, player) =>
        context.player === player.opponent && (context.ability.isCardAbility() || !context.ability.isCardPlayed()) &&
        [CardTypes.Event, CardTypes.Character, CardTypes.Holding, CardTypes.Attachment, CardTypes.Stronghold, CardTypes.Province, CardTypes.Role].includes(context.source.type),
    opponentsEvents: (context, player) =>
        context.player && context.player === player.opponent && context.source.type === CardTypes.Event,
    opponentsRingEffects: (context, player) =>
        context.player && context.player === player.opponent && context.source.type === 'ring',
    source: (context, player, source) => context.source === source
};
class CannotRestriction {
    constructor(properties) {
        if(typeof properties === 'string') {
            this.type = properties;
        } else {
            this.type = properties.cannot;
            this.restriction = properties.restricts;
            this.params = properties.params;
        }
        this.context = {};
    }

    isMatch(type, abilityContext) {
        return (!this.type || this.type === type) && this.checkCondition(abilityContext);
    }

    checkCondition(context) {
        if(!this.restriction) {
            return true;
        } else if(!context) {
            throw new Error('checkRestrictions called without a context');
        } else if(!checkRestrictions[this.restriction]) {
            return context.source.hasTrait(this.restriction);
        }
        let player = this.player || this.context.source && this.context.source.controller;
        return checkRestrictions[this.restriction](context, player, this.context.source, this.params);
    }
}

module.exports = CannotRestriction;
