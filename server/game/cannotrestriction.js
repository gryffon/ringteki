const checkRestrictions = {
    copiesOfDiscardEvents: context =>
        context.source.type === 'event' && context.player.conflictDiscardPile.any(card => card.name === context.source.name),
    copiesOfX: (context, player, source, params) => context.source.name === params,
    events: context => context.source.type === 'event',
    nonSpellEvents: context => context.source.type === 'event' && !context.source.hasTrait('spell'),
    opponentsCardEffects: (context, player) =>
        context.player === player.opponent && (context.ability.isCardAbility() || !context.ability.isCardPlayed()) &&
        ['event', 'character', 'holding', 'attachment', 'stronghold', 'province', 'role'].includes(context.source.type),
    opponentsEvents: (context, player) =>
        context.player && context.player === player.opponent && context.source.type === 'event',
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
            this.player = properties.player;
            this.source = properties.source;
            this.params = properties.params;
        }
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
        let player = this.player || this.source && this.source.controller;
        return checkRestrictions[this.restriction](context, player, this.source, this.params);
    }
}

module.exports = CannotRestriction;
