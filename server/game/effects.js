const _ = require('underscore');

const AbilityLimit = require('./abilitylimit.js');
const CannotRestriction = require('./cannotrestriction.js');
const CostReducer = require('./costreducer')
const EffectBuilder = require('./Effects/EffectBuilder');
const ImmunityRestriction = require('./immunityrestriction.js');
const PlayableLocation = require('./playablelocation.js');

/* Types of effect
    1. Static effects - do something for a period
    2. Dynamic effects - like static, but what they do depends on the game state
    3. Detached effects - do something when applied, and on expiration, but can be ignored in the interim
*/

const Effects = {
    addElement: (element) => EffectBuilder.ring.static('addElement', element),
    addFaction: (faction) => EffectBuilder.card.static('addFaction', faction),
    addKeyword: (keyword) => EffectBuilder.card.static('addKeyword', keyword),
    addTrait: (trait) => EffectBuilder.card.static('addTrait', trait),
    blank: EffectBuilder.card.static('blank'), 
    cannotDeclareRing: (match) => EffectBuilder.ring.static('cannotDeclare', match),
    canPlayFromOwn: (location) => EffectBuilder.player.detached('canPlayFromOwn', {
        apply: (player) => {
            let playableLocation = new PlayableLocation('play', player, location);
            player.playableLocations.push(playableLocation);
            return playableLocation;
        },
        unapply: (player, context, state) => player.playableLocations = _.reject(player.playableLocations, l => l === state)
    }),
    cardCannot: (type, predicate) => EffectBuilder.card.static('abilityRestrictions', new CannotRestriction(type, predicate)),
    considerRingAsClaimed: (match) => EffectBuilder.ring.static('considerAsClaimed', match),
    contributeToConflict: (card) => EffectBuilder.conflict.static('contribute', card),
    changeConflictSkillFunction: (func) => EffectBuilder.conflict.static('skillFunction', func),
    changePlayerGloryModifier: (value) => EffectBuilder.player.static('gloryModifier', value),
    delayedEffect: (properties) => EffectBuilder.card.detached('delayedEffect', {
        apply: (card, context) => {
            properties.target = card;
            properties.context = properties.context || context;
            return context.source.delayedEffect(properties);
        },
        unapply: (card, context, state) => context.game.effectEngine.removeDelayedEffect(state)
    }),
    doesNotBow: EffectBuilder.card.static('doesNotBow'),
    doesNotReady: EffectBuilder.card.static('doesNotReady'),
    gainAbility: (abilityType, properties) => EffectBuilder.card.detached('gainAbility', {
        apply: (card, context) => {
            abilityType = abilityType === 'cancelinterrupt' ? 'interrupt' : abilityType;
            abilityType = abilityType === 'forcedinterrupt' ? 'forcedInterrupt' : abilityType;
            abilityType = abilityType === 'forcedreaction' ? 'forcedReaction' : abilityType;
            card[abilityType](properties);
            let ability = _.last(card.abilities[abilityType === 'action' ? 'actions' : 'reactions']);
            if(abilityType !== 'action') {
                ability.registerEvents();
            }
            if(context.source.grantedAbilityLimits[card.uuid]) {
                ability.limit = context.source.grantedAbilityLimits[card.uuid];
            } else {
                context.source.grantedAbilityLimits[card.uuid] = ability.limit;
            }
            return ability;
        },
        unapply: (card, context, state) => {
            let list = abilityType === 'action' ? 'actions' : 'reactions';
            if(abilityType !== 'action') {
                state.unregisterEvents();
            }
            card.abilities[list] = _.reject(card.abilities[list], ability => ability === state);
        }
    }),
    immuneTo: (condition) => EffectBuilder.card.static('abilityRestrictions', new ImmunityRestriction(condition)),
    increaseCost: (properties) => Effects.reduceCost(_.extend(properties, { amount: -properties.amount })),
    increaseLimitOnAbilities: (amount) => EffectBuilder.card.static('increaseLimitOnAbilities', amount),
    modifyBaseMilitarySkill: (value) => EffectBuilder.card.flexible('modifyBaseMilitarySkill', value),
    modifyBasePoliticalSkill: (value) => EffectBuilder.card.flexible('modifyBasePoliticalSkill', value),
    modifyConflictElementsToResolve: (value) => EffectBuilder.conflict.static('modifyConflictElementsToResolve', value),
    modifyGlory: (value) => EffectBuilder.card.flexible('modifyGlory', value),
    modifyMilitarySkill: (value) => EffectBuilder.card.flexible('modifyMilitarySkill', value),
    modifyMilitarySkillMultiplier: (value) => EffectBuilder.card.flexible('modifyMilitarySkillMultiplier', value),
    modifyPoliticalSkill: (value) => EffectBuilder.card.flexible('modifyPoliticalSkill', value),
    modifyPoliticalSkillMultiplier: (value) => EffectBuilder.card.flexible('modifyPoliticalSkillMultiplier', value),
    modifyProvinceStrength: (value) => EffectBuilder.card.flexible('modifyProvinceStrength', value),
    playerCannot: (type, predicate) => EffectBuilder.player.static('restriction', new CannotRestriction(type, predicate)),
    reduceCost: (properties) => EffectBuilder.player.detached('costReducer', {
        apply: (player, context) => player.addCostReducer(new CostReducer(context.game, context.source, properties)),
        unapply: (player, context, state) => player.removeCostReducer(state)
    }),
    reduceNextPlayedCardCost: (amount, match) => Effects.reduceCost({ amount: amount, match: match, limit: AbilityLimit.fixed(1) }),
    removeAction: (action) => EffectBuilder.card.detached('removeAction', {
        apply: () => true,
        unapply: (card) => card.abilities.actions = _.reject(card.abilities.actions, ability => ability === action)
    }),
    removeReaction: (reaction) => EffectBuilder.card.detached('removeReaction', {
        apply: () => true,
        unapply: (card) => card.abilities.reactions = _.reject(card.reabilities.actions, ability => ability === reaction)
    }),
    restrictNumberOfDefenders: (value) => EffectBuilder.conflict.static('restrictNumberOfDefenders', value),
    showTopConflictCard: EffectBuilder.player.static('showTopConflictCard'),
    takeControl: (player) => EffectBuilder.card.static('takeControl', player),
    terminalCondition: (properties) => EffectBuilder.card.detached('terminalCondition', {
        apply: (card, context) => {
            properties.target = card;
            properties.context = properties.context || context;
            return context.source.terminalCondition(properties);    
        },
        unapply: (card, context, state) => context.game.effectEngine.removeTerminalCondition(state)
    })
};

module.exports = Effects;
