import _ = require('underscore');

const AbilityDsl = require('./abilitydsl.js');
const CustomPlayAction = require('./customplayaction.js');
const EffectSource = require('./EffectSource.js');
import CardAbility = require('./CardAbility');
import CardAction = require('./cardaction.js');
import TriggeredAbility = require('./triggeredability');
import AbilityContext = require('./AbilityContext');
import Player = require('./player');
import Game = require('./game');

import { Locations, EffectNames, Durations, CardTypes, EventNames, AbilityTypes, Players } from './Constants';
import { ActionProps, TriggeredAbilityProps, PersistentEffectProps } from './Interfaces'; 

class BaseCard extends EffectSource {
    owner: Player;
    controller: Player;
    game: Game;
    cardData;

    id: string;
    printedName: string;
    inConflict: boolean = false;
    type: CardTypes;
    
    tokens: object = {};
    menu: _.Underscore<any> = _([]);
    showPopup: boolean = false;
    popupMenuText: string = '';
    abilities: any = { actions: [], reactions: [], persistentEffects: [], playActions: [] };
    traits: string[];
    printedFaction: string;
    location: Locations;

    isProvince: boolean = false;
    isConflict: boolean = false;
    isDynasty: boolean = false;
    isStronghold: boolean = false;

    constructor(owner, cardData) {
        super(owner.game);
        this.owner = owner;
        this.controller = owner;
        this.cardData = cardData;

        this.id = cardData.id;
        this.printedName = cardData.name;
        this.type = cardData.type;
        this.traits = cardData.traits || [];
        this.printedFaction = cardData.clan;

        this.setupCardAbilities(AbilityDsl);
    }

    get name(): string {
        let copyEffect = this.mostRecentEffect(EffectNames.CopyCharacter);
        return copyEffect ? copyEffect.printedName : this.printedName;
    }

    set name(name: string) {
        this.printedName = name;
    }

    get actions(): CardAction[] {
        let actions = this.abilities.actions;
        if(this.anyEffect(EffectNames.CopyCharacter)) {
            let mostRecentEffect = _.last(this.effects.filter(effect => effect.type === EffectNames.CopyCharacter));
            actions = mostRecentEffect.value.getActions(this);
        }
        let effectActions = this.getEffects(EffectNames.GainAbility).filter(ability => ability.abilityType === AbilityTypes.Action);
        return actions.concat(effectActions);
    }

    get reactions(): TriggeredAbility[] {
        const TriggeredAbilityTypes = [AbilityTypes.ForcedInterrupt, AbilityTypes.ForcedReaction, AbilityTypes.Interrupt, AbilityTypes.Reaction, AbilityTypes.WouldInterrupt];
        let reactions =  this.abilities.reactions;
        if(this.anyEffect(EffectNames.CopyCharacter)) {
            let mostRecentEffect = _.last(this.effects.filter(effect => effect.type === EffectNames.CopyCharacter));
            reactions = mostRecentEffect.value.getReactions(this);
        }
        let effectReactions = this.getEffects(EffectNames.GainAbility).filter(ability => TriggeredAbilityTypes.includes(ability.abilityType));
        return reactions.concat(effectReactions);
    }

    get persistentEffects(): any[] {
        if(this.anyEffect(EffectNames.CopyCharacter)) {
            let mostRecentEffect = _.last(this.effects.filter(effect => effect.type === EffectNames.CopyCharacter));
            return mostRecentEffect.value.getPersistentEffects();
        }
        return this.isBlank() ? [] : this.abilities.persistentEffects;
    }

    /**
     * Create card abilities by calling subsequent methods with appropriate properties
     * @param {Object} ability - AbilityDsl object containing limits, costs, effects, and game actions
     */
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
    }

    action(properties: ActionProps): void {
        this.abilities.actions.push(this.createAction(properties));
    }

    createAction(properties: ActionProps): CardAction {
        return new CardAction(this.game, this, properties);
    }

    triggeredAbility(abilityType: AbilityTypes, properties: TriggeredAbilityProps): void {
        this.abilities.reactions.push(this.createTriggeredAbility(abilityType, properties));
    }

    createTriggeredAbility(abilityType: AbilityTypes, properties: TriggeredAbilityProps): TriggeredAbility {
        return new TriggeredAbility(this.game, this, abilityType, properties);
    }

    reaction(properties: TriggeredAbilityProps): void {
        this.triggeredAbility(AbilityTypes.Reaction, properties);
    }

    forcedReaction(properties: TriggeredAbilityProps): void {
        this.triggeredAbility(AbilityTypes.ForcedReaction, properties);
    }

    wouldInterrupt(properties: TriggeredAbilityProps): void {
        this.triggeredAbility(AbilityTypes.WouldInterrupt, properties);
    }

    interrupt(properties: TriggeredAbilityProps): void {
        this.triggeredAbility(AbilityTypes.Interrupt, properties);
    }

    forcedInterrupt(properties: TriggeredAbilityProps): void {
        this.triggeredAbility(AbilityTypes.ForcedInterrupt, properties);
    }

    /**
     * Defines a special play action that can occur when the card is outside the
     * play area (e.g. Lady-in-Waiting's dupe marshal ability)
     */
    playAction(properties): void {
        this.abilities.playActions.push(new CustomPlayAction(properties));
    }

    /**
     * Applies an effect that continues as long as the card providing the effect
     * is both in play and not blank.
     */
    persistentEffect(properties: PersistentEffectProps): void {
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

    composure(properties): void {
        this.persistentEffect(Object.assign({ condition: context => context.player.hasComposure() }, properties));
    }

    hasTrait(trait: string): boolean {
        trait = trait.toLowerCase();
        return this.getTraits().includes(trait) || this.getEffects(EffectNames.AddTrait).includes(trait);
    }

    getTraits(): string[] {
        let copyEffect = this.mostRecentEffect(EffectNames.CopyCharacter);
        let traits = copyEffect ? copyEffect.traits : this.traits;
        return _.uniq(traits.concat(this.getEffects(EffectNames.AddTrait)));
    }

    isFaction(faction: string): boolean {
        faction = faction.toLowerCase();
        if(faction === 'neutral') {
            return this.printedFaction === faction && !this.anyEffect(EffectNames.AddFaction);
        }
        return this.printedFaction === faction || this.getEffects(EffectNames.AddFaction).includes(faction);
    }

    applyAnyLocationPersistentEffects(): void {
        _.each(this.persistentEffects, effect => {
            if(effect.location === Locations.Any) {
                effect.ref = this.addEffectToEngine(effect);
            }
        });
    }

    leavesPlay(): void {
        this.tokens = {};
        _.each(this.abilities.actions, action => action.limit.reset());
        _.each(this.abilities.reactions, reaction => reaction.limit.reset());
        this.controller = this.owner;
        this.inConflict = false;
    }

    updateAbilityEvents(from: Locations, to: Locations) {
        _.each(this.reactions, reaction => {
            reaction.limit.reset();
            if((reaction.location.includes(to) || this.type === CardTypes.Event && to === Locations.ConflictDeck) && !reaction.location.includes(from)) {
                reaction.registerEvents();
            } else if(!reaction.location.includes(to) && (reaction.location.includes(from) || this.type === CardTypes.Event && to === Locations.ConflictDeck)) {
                reaction.unregisterEvents();
            }
        });
        _.each(this.abilities.actions, action => action.limit.reset());
    }

    updateEffects(from: Locations, to: Locations) {
        const activeLocations = {
            'play area': [Locations.PlayArea],
            'province': [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour, Locations.StrongholdProvince]
        };
        if(from === Locations.PlayArea || this.type === CardTypes.Holding && activeLocations[Locations.Provinces].includes(from) && !activeLocations[Locations.Provinces].includes(to)) {
            this.removeLastingEffects();
        }
        _.each(this.persistentEffects, effect => {
            if(effect.location !== Locations.Any) {
                if(activeLocations[effect.location].includes(to) && !activeLocations[effect.location].includes(from)) {
                    effect.ref = this.addEffectToEngine(effect);
                } else if(!activeLocations[effect.location].includes(to) && activeLocations[effect.location].includes(from)) {
                    this.removeEffectFromEngine(effect.ref);
                    effect.ref = [];
                }
            }
        });
    }

    updateEffectContexts() {
        for(const effect of this.persistentEffects) {
            if(effect.ref) {
                for(let e of effect.ref) {
                    e.refreshContext();
                }
            }
        }
    }

    moveTo(targetLocation: Locations) {
        let originalLocation = this.location;

        this.location = targetLocation;

        if([Locations.PlayArea, Locations.ConflictDiscardPile, Locations.DynastyDiscardPile, Locations.Hand].includes(targetLocation)) {
            this.facedown = false;
        }

        if(originalLocation !== targetLocation) {
            this.updateAbilityEvents(originalLocation, targetLocation);
            this.updateEffects(originalLocation, targetLocation);
            this.game.emitEvent(EventNames.OnCardMoved, { card: this, originalLocation: originalLocation, newLocation: targetLocation });
        }
    }

    canTriggerAbilities(context: AbilityContext): boolean {
        return !this.facedown && (this.checkRestrictions('triggerAbilities', context) || !context.ability.isTriggeredAbility());
    }

    getModifiedLimitMax(player: Player, ability: CardAbility, max: number): number {
        const effects = this.effects.filter(effect => effect.type === EffectNames.IncreaseLimitOnAbilities);
        return effects.reduce((total, effect) => {
            const value = effect.getValue(this);
            if((value === true || value === ability) && effect.context.player === player) {
                return total + 1;
            }
            return total;
        }, max);
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

    isConflictProvince(): boolean {
        return false;
    }

    isAttacking(): boolean {
        return this.game.currentConflict && this.game.currentConflict.isAttacking(this);
    }

    isDefending(): boolean {
        return this.game.currentConflict && this.game.currentConflict.isDefending(this);
    }

    isParticipating(): boolean {
        return this.game.currentConflict && this.game.currentConflict.isParticipating(this);
    }

    isUnique(): boolean{
        return this.cardData.unicity;
    }

    isBlank(): boolean {
        return this.anyEffect(EffectNames.Blank) || this.anyEffect(EffectNames.CopyCharacter);
    }

    getPrintedFaction(): string {
        return this.cardData.clan;
    }

    checkRestrictions(actionType, context: AbilityContext = null): boolean {
        return super.checkRestrictions(actionType, context) && this.controller.checkRestrictions(actionType, context);
    }


    addToken(type: string, number: number = 1): void {
        if(_.isUndefined(this.tokens[type])) {
            this.tokens[type] = 0;
        }

        this.tokens[type] += number;
    }

    hasToken(type: string): boolean {
        return !!this.tokens[type];
    }

    removeToken(type: string, number: number): void {
        this.tokens[type] -= number;

        if(this.tokens[type] < 0) {
            this.tokens[type] = 0;
        }

        if(this.tokens[type] === 0) {
            delete this.tokens[type];
        }
    }

    getActions(): any[] {
        return this.actions.slice();
    }

    getProvinceStrengthBonus(): number {
        return 0;
    }

    readiesDuringReadyPhase(): boolean {
        return !this.anyEffect(EffectNames.DoesNotReady);
    }

    hideWhenFacedown(): boolean {
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

export = BaseCard;
