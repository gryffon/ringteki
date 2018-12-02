const _ = require('underscore');

const AbilityDsl = require('./abilitydsl.js');
const CardAction = require('./cardaction.js');
const CustomPlayAction = require('./customplayaction.js');
const EffectSource = require('./EffectSource.js');
const TriggeredAbility = require('./triggeredability');

const { Locations, EffectNames, Durations, CardTypes } = require('./Constants');

class BaseCard extends EffectSource {
    constructor(owner, cardData) {
        super(owner.game);
        this.owner = owner;
        this.controller = owner;
        this.cardData = cardData;

        this.id = cardData.id;
        this.name = cardData.name;
        this.inConflict = false;

        this.type = cardData.type;

        this.tokens = {};
        this.menu = _([]);

        this.showPopup = false;
        this.popupMenuText = '';

        this.abilities = { actions: [], reactions: [], persistentEffects: [], playActions: [] };
        this.traits = cardData.traits || [];
        this.setupCardAbilities(AbilityDsl);

        this.printedFaction = cardData.clan;

        this.isProvince = false;
        this.isConflict = false;
        this.isDynasty = false;
        this.isStronghold = false;
    }

    /**
     * Create card abilities by calling subsequent methods with appropriate properties
     * @param {AbilityDsl} ability - object containing limits, costs, effects, and game actions
     */
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
    }

    action(properties) {
        var action = new CardAction(this.game, this, properties);
        this.abilities.actions.push(action);
        return action;
    }

    triggeredAbility(abilityType, properties) {
        let reaction = new TriggeredAbility(this.game, this, abilityType, properties);
        this.abilities.reactions.push(reaction);
        return reaction;
    }

    reaction(properties) {
        this.triggeredAbility('reaction', properties);
    }

    forcedReaction(properties) {
        this.triggeredAbility('forcedreaction', properties);
    }

    wouldInterrupt(properties) {
        this.triggeredAbility('cancelinterrupt', properties);
    }

    interrupt(properties) {
        this.triggeredAbility('interrupt', properties);
    }

    forcedInterrupt(properties) {
        this.triggeredAbility('forcedinterrupt', properties);
    }

    /**
     * Defines a special play action that can occur when the card is outside the
     * play area (e.g. Lady-in-Waiting's dupe marshal ability)
     */
    playAction(properties) {
        this.abilities.playActions.push(new CustomPlayAction(properties));
    }

    /**
     * Applies an effect that continues as long as the card providing the effect
     * is both in play and not blank.
     */
    persistentEffect(properties) {
        const allowedLocations = [Locations.Any, Locations.PlayArea, Locations.Provinces];
        const defaultLocationForType = {
            province: Locations.Provinces,
            holding: Locations.Provinces,
            stronghold: Locations.Provinces
        };

        let location = properties.location || defaultLocationForType[this.getType()] || Locations.PlayArea;
        if(!allowedLocations.includes(location)) {
            throw new Error(`'${location}' is not a supported effect location.`);
        }

        this.abilities.persistentEffects.push(_.extend({ duration: Durations.Persistent, location: location }, properties));
    }

    hasTrait(trait) {
        trait = trait.toLowerCase();
        return this.traits.includes(trait) || this.getEffects(EffectNames.AddTrait).includes(trait);
    }

    getTraits() {
        let traits = this.traits.concat(this.getEffects(EffectNames.AddTrait));
        return _.uniq(traits);
    }

    isFaction(faction) {
        faction = faction.toLowerCase();
        if(faction === 'neutral') {
            return this.printedFaction === faction && !this.anyEffect(EffectNames.AddFaction);
        }
        return this.printedFaction === faction || this.getEffects(EffectNames.AddFaction).includes(faction);
    }

    applyAnyLocationPersistentEffects() {
        _.each(this.abilities.persistentEffects, effect => {
            if(effect.location === Locations.Any) {
                this.addEffectToEngine(effect);
            }
        });
    }

    leavesPlay() {
        this.tokens = {};
        _.each(this.abilities.actions, action => action.limit.reset());
        _.each(this.abilities.reactions, reaction => reaction.limit.reset());
        this.controller = this.owner;
        this.inConflict = false;
    }

    updateAbilityEvents(from, to) {
        _.each(this.abilities.reactions, reaction => {
            if((reaction.location.includes(to) || this.type === CardTypes.Event && to === Locations.ConflictDeck) && !reaction.location.includes(from)) {
                reaction.registerEvents();
            } else if(!reaction.location.includes(to) && (reaction.location.includes(from) || this.type === CardTypes.Event && to === Locations.ConflictDeck)) {
                reaction.unregisterEvents();
            }
        });
    }

    updateEffects(from = '', to = '') {
        const activeLocations = {
            'play area': [Locations.PlayArea],
            'province': [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour, Locations.StrongholdProvince]
        };
        if(from === Locations.PlayArea || this.type === CardTypes.Holding && activeLocations[Locations.Provinces].includes(from) && !activeLocations[Locations.Provinces].includes(to)) {
            this.removeLastingEffects();
        }
        _.each(this.abilities.persistentEffects, effect => {
            if(effect.location !== Locations.Any) {
                if(activeLocations[effect.location].includes(to) && !activeLocations[effect.location].includes(from)) {
                    effect.ref = this.addEffectToEngine(effect);
                } else if(!activeLocations[effect.location].includes(to) && activeLocations[effect.location].includes(from)) {
                    this.removeEffectFromEngine(effect.ref);
                }
            }
        });
    }

    moveTo(targetLocation) {
        let originalLocation = this.location;

        this.location = targetLocation;

        if([Locations.PlayArea, Locations.ConflictDiscardPile, Locations.DynastyDiscardPile, Locations.Hand].includes(targetLocation)) {
            this.facedown = false;
        }

        if(originalLocation !== targetLocation) {
            this.updateAbilityEvents(originalLocation, targetLocation);
            this.updateEffects(originalLocation, targetLocation);
            this.game.emitEvent('onCardMoved', { card: this, originalLocation: originalLocation, newLocation: targetLocation });
        }
    }

    canTriggerAbilities(context) {
        return !this.facedown && (this.checkRestrictions('triggerAbilities', context) || !context.ability.isTriggeredAbility());
    }

    getModifiedLimitMax(max) {
        return this.sumEffects(EffectNames.IncreaseLimitOnAbilities) + max;
    }

    getMenu() {
        var menu = [];

        if(this.menu.isEmpty() || !this.game.manualMode ||
                ![Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour, Locations.StrongholdProvince, Locations.PlayArea].includes(this.location)) {
            return undefined;
        }

        if(this.facedown) {
            return [{ command: 'reveal', text: 'Reveal' }];
        }

        menu.push({ command: 'click', text: 'Select Card' });
        if(this.location === Locations.PlayArea || this.isProvince || this.isStronghold) {
            menu = menu.concat(this.menu.value());
        }

        return menu;
    }

    isConflictProvince() {
        return false;
    }

    isAttacking() {
        return this.game.currentConflict && this.game.currentConflict.isAttacking(this);
    }

    isDefending() {
        return this.game.currentConflict && this.game.currentConflict.isDefending(this);
    }

    isParticipating() {
        return this.game.currentConflict && this.game.currentConflict.isParticipating(this);
    }

    isUnique() {
        return this.cardData.unicity;
    }

    isBlank() {
        return this.anyEffect(EffectNames.Blank);
    }

    getPrintedFaction() {
        return this.cardData.clan;
    }

    checkRestrictions(actionType, context = null) {
        return super.checkRestrictions(actionType, context) && this.controller.checkRestrictions(actionType, context);
    }


    addToken(type, number = 1) {
        if(_.isUndefined(this.tokens[type])) {
            this.tokens[type] = 0;
        }

        this.tokens[type] += number;
    }

    hasToken(type) {
        return !!this.tokens[type];
    }

    removeToken(type, number) {
        this.tokens[type] -= number;

        if(this.tokens[type] < 0) {
            this.tokens[type] = 0;
        }

        if(this.tokens[type] === 0) {
            delete this.tokens[type];
        }
    }

    getActions() {
        return this.abilities.actions.slice();
    }

    getProvinceStrengthBonus() {
        return 0;
    }

    readiesDuringReadyPhase() {
        return !this.anyEffect(EffectNames.DoesNotReady);
    }

    hideWhenFacedown() {
        return !this.anyEffect(EffectNames.CanBeSeenWhenFacedown);
    }

    createSnapshot() {
        return {};
    }

    getShortSummaryForControls(activePlayer) {
        if(this.facedown && (activePlayer !== this.controller || this.hideWhenFacedown())) {
            return { facedown: true, isDynasty: this.isDynasty, isConflict: this.isConflict };
        }
        return super.getShortSummary();
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let isActivePlayer = activePlayer === this.controller;
        let selectionState = activePlayer.getCardSelectionState(this);

        // This is my facedown card, but I'm not allowed to look at it
        // OR This is not my card, and it's either facedown or hidden from me
        if(isActivePlayer ? this.facedown && this.hideWhenFacedown() : (this.facedown || hideWhenFaceup || this.anyEffect(EffectNames.HideWhenFaceUp))) {
            let state = {
                controller: this.controller.name,
                facedown: true,
                inConflict: this.inConflict,
                location: this.location
            };
            return Object.assign(state, selectionState);
        }

        let state = {
            id: this.cardData.id,
            controlled: this.owner !== this.controller,
            inConflict: this.inConflict,
            facedown: this.facedown,
            location: this.location,
            menu: this.getMenu(),
            name: this.cardData.name,
            popupMenuText: this.popupMenuText,
            showPopup: this.showPopup,
            tokens: this.tokens,
            type: this.getType(),
            uuid: this.uuid
        };

        return Object.assign(state, selectionState);
    }
}

module.exports = BaseCard;
