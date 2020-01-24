import _ = require('underscore');

const AbilityDsl = require('./abilitydsl.js');
const CustomPlayAction = require('./customplayaction.js');
const Effects = require('./effects');
const EffectSource = require('./EffectSource.js');
import CardAbility = require('./CardAbility');
import CardAction = require('./cardaction.js');
import TriggeredAbility = require('./triggeredability');
import AbilityContext = require('./AbilityContext');
import Player = require('./player');
import Game = require('./game');

import { Locations, EffectNames, Durations, CardTypes, EventNames, AbilityTypes, Players } from './Constants';
import { ActionProps, TriggeredAbilityProps, PersistentEffectProps, AttachmentConditionProps } from './Interfaces';
import PlayDisguisedCharacterAction = require('./PlayDisguisedCharacterAction');
import DynastyCardAction = require('./dynastycardaction');
import PlayCharacterAction = require('./playcharacteraction');
import PlayAttachmentAction = require('./playattachmentaction');
import PlayAttachmentOnRingAction = require('./playattachmentonringaction.js');


const ValidKeywords = [
    'ancestral',
    'restricted',
    'limited',
    'sincerity',
    'courtesy',
    'pride',
    'covert'
];

class BaseCard extends EffectSource {
    owner: Player;
    controller: Player;
    game: Game;
    cardData;

    id: string;
    printedName: string;
    inConflict: boolean = false;
    type: CardTypes;
    facedown: boolean;

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
        this.printedType = cardData.type;
        this.traits = cardData.traits || [];
        this.printedFaction = cardData.clan;
        this.attachments = _([]);
        this.childCards = [];

        this.setupCardAbilities(AbilityDsl);
        this.applyAttachmentBonus();
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
            let mostRecentEffect = _.last(this.getRawEffects().filter(effect => effect.type === EffectNames.CopyCharacter));
            actions = mostRecentEffect.value.getActions(this);
        }
        let effectActions = this.getEffects(EffectNames.GainAbility).filter(ability => ability.abilityType === AbilityTypes.Action);
        return actions.concat(effectActions);
    }

    get reactions(): TriggeredAbility[] {
        const TriggeredAbilityTypes = [AbilityTypes.ForcedInterrupt, AbilityTypes.ForcedReaction, AbilityTypes.Interrupt, AbilityTypes.Reaction, AbilityTypes.WouldInterrupt];
        let reactions =  this.abilities.reactions;
        if(this.anyEffect(EffectNames.CopyCharacter)) {
            let mostRecentEffect = _.last(this.getRawEffects().filter(effect => effect.type === EffectNames.CopyCharacter));
            reactions = mostRecentEffect.value.getReactions(this);
        }
        let effectReactions = this.getEffects(EffectNames.GainAbility).filter(ability => TriggeredAbilityTypes.includes(ability.abilityType));
        return reactions.concat(effectReactions);
    }

    get persistentEffects(): any[] {
        let gainedPersistentEffects = this.getEffects(EffectNames.GainAbility).filter(ability => ability.abilityType === AbilityTypes.Persistent);
        if(this.anyEffect(EffectNames.CopyCharacter)) {
            let mostRecentEffect = _.last(this.getRawEffects().filter(effect => effect.type === EffectNames.CopyCharacter));
            return gainedPersistentEffects.concat(mostRecentEffect.value.getPersistentEffects());
        }
        return this.isBlank() ? gainedPersistentEffects : this.abilities.persistentEffects.concat(gainedPersistentEffects);
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
        const allowedLocations = [Locations.Any, Locations.ConflictDiscardPile, Locations.PlayArea, Locations.Provinces];
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

    attachmentConditions(properties: AttachmentConditionProps): void {
        const effects = [];
        if(properties.limit) {
            effects.push(Effects.attachmentLimit(properties.limit));
        }
        if(properties.myControl) {
            effects.push(Effects.attachmentMyControlOnly());
        }
        if(properties.unique) {
            effects.push(Effects.attachmentUniqueRestriction());
        }
        if(properties.faction) {
            const factions = Array.isArray(properties.faction) ? properties.faction : [properties.faction];
            effects.push(Effects.attachmentFactionRestriction(factions));
        }
        if(properties.trait) {
            const traits = Array.isArray(properties.trait) ? properties.trait : [properties.trait];
            effects.push(Effects.attachmentTraitRestriction(traits));
        }
        if(properties.limitTrait) {
            const traitLimits = Array.isArray(properties.limitTrait) ? properties.limitTrait : [properties.limitTrait];
            traitLimits.forEach(traitLimit => {
                const trait = Object.keys(traitLimit)[0];
                effects.push(Effects.attachmentRestrictTraitAmount({ [trait]: traitLimit[trait]}))
            });
        }
        if(effects.length > 0) {
            this.persistentEffect({
                location: Locations.Any,
                effect: effects
            });
        }
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
        let traits = copyEffect ? copyEffect.traits : this.getEffects(EffectNames.Blank).some(blankTraits => blankTraits) ? [] : this.traits;
        return _.uniq(traits.concat(this.getEffects(EffectNames.AddTrait)));
    }

    isFaction(faction: string): boolean {
        faction = faction.toLowerCase();
        if(faction === 'neutral') {
            return this.printedFaction === faction && !this.anyEffect(EffectNames.AddFaction);
        }
        return this.printedFaction === faction || this.getEffects(EffectNames.AddFaction).includes(faction);
    }

    isInProvince(): boolean {
        return [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree,
            Locations.ProvinceFour, Locations.StrongholdProvince].includes(this.location);
    }

    isInPlay(): boolean {
        if(this.facedown) {
            return false;
        }
        if([CardTypes.Holding, CardTypes.Province, CardTypes.Stronghold].includes(this.type)) {
            return this.isInProvince();
        }
        return this.location === Locations.PlayArea;
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
            if(this.type === CardTypes.Event) {
                if(to === Locations.ConflictDeck || this.controller.isCardInPlayableLocation(this) || this.controller.opponent && this.controller.opponent.isCardInPlayableLocation(this)) {
                    reaction.registerEvents();
                } else {
                    reaction.unregisterEvents();
                }
            } else if(reaction.location.includes(to) && !reaction.location.includes(from)) {
                reaction.registerEvents();
            } else if(!reaction.location.includes(to) && reaction.location.includes(from)) {
                reaction.unregisterEvents();
            }
        });
        _.each(this.abilities.actions, action => action.limit.reset());
    }

    updateEffects(from: Locations, to: Locations) {
        const activeLocations = {
            'conflict discard pile': [Locations.ConflictDiscardPile],
            'play area': [Locations.PlayArea],
            'province': [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour, Locations.StrongholdProvince]
        };
        if(!activeLocations[Locations.Provinces].includes(from) || !activeLocations[Locations.Provinces].includes(to)) {
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
        return !this.facedown && this.checkRestrictions('triggerAbilities', context);
    }

    canInitiateKeywords(context: AbilityContext): boolean {
        return !this.facedown && this.checkRestrictions('initiateKeywords', context);
    }

    getModifiedLimitMax(player: Player, ability: CardAbility, max: number): number {
        const effects = this.getRawEffects().filter(effect => effect.type === EffectNames.IncreaseLimitOnAbilities);
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

    checkRestrictions(actionType, context: AbilityContext): boolean {
        return super.checkRestrictions(actionType, context) && this.controller.checkRestrictions(actionType, context);
    }


    addToken(type: string, number: number = 1): void {
        if(_.isUndefined(this.tokens[type])) {
            this.tokens[type] = 0;
        }

        this.tokens[type] += number;
    }

    getTokenCount(type: string): number {
        if(_.isUndefined(this.tokens[type])) {
            return 0;
        }
        return this.tokens[type];
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

    getReactions(): any[] {
        return this.reactions.slice();
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

    parseKeywords(text) {
        var lines = text.split('\n');
        var potentialKeywords = [];
        _.each(lines, line => {
            line = line.slice(0, -1);
            _.each(line.split('. '), k => potentialKeywords.push(k));
        });

        this.printedKeywords = [];
        this.allowedAttachmentTraits = [];
        this.disguisedKeywordTraits = [];

        _.each(potentialKeywords, keyword => {
            if(_.contains(ValidKeywords, keyword)) {
                this.printedKeywords.push(keyword);
            } else if(keyword.startsWith('disguised ')) {
                this.disguisedKeywordTraits.push(keyword.replace('disguised ', ''));
            } else if(keyword.startsWith('no attachments except')) {
                var traits = keyword.replace('no attachments except ', '');
                this.allowedAttachmentTraits = traits.split(' or ');
            } else if(keyword.startsWith('no attachments')) {
                this.allowedAttachmentTraits = ['none'];
            }
        });

        this.printedKeywords.forEach(keyword => {
            this.persistentEffect({
                effect: AbilityDsl.effects.addKeyword(keyword)
            });
        });
    }

    applyAttachmentBonus() {
        let militaryBonus = parseInt(this.cardData.military_bonus);
        if(militaryBonus) {
            this.persistentEffect({
                match: (card) => card === this.parent,
                targetController: Players.Any,
                effect: AbilityDsl.effects.attachmentMilitarySkillModifier(militaryBonus)
            });
        }
        let politicalBonus = parseInt(this.cardData.political_bonus);
        if(politicalBonus) {
            this.persistentEffect({
                match: (card) => card === this.parent,
                targetController: Players.Any,
                effect: AbilityDsl.effects.attachmentPoliticalSkillModifier(politicalBonus)
            });
        }
    }

    checkForIllegalAttachments() {
        let context = this.game.getFrameworkContext(this.controller);
        let illegalAttachments = this.attachments.filter(attachment => (
            !this.allowAttachment(attachment) || !attachment.canAttach(this, { game: this.game, player: this.controller })
        ));
        for(const effectCard of this.getEffects(EffectNames.CannotHaveOtherRestrictedAttachments)) {
            illegalAttachments = illegalAttachments.concat(this.attachments.filter(card => card.isRestricted() && card !== effectCard));
        }
        for(const card of this.attachments.filter(card => card.anyEffect(EffectNames.AttachmentLimit))) {
            const limit = Math.max(...card.getEffects(EffectNames.AttachmentLimit));
            const matchingAttachments = this.attachments.filter(attachment => attachment.id === card.id);
            illegalAttachments = illegalAttachments.concat(matchingAttachments.slice(0, -limit));
        }
        for(const object of this.attachments.reduce((array, card) => array.concat(card.getEffects(EffectNames.AttachmentRestrictTraitAmount)), [])) {
            for(const trait of Object.keys(object)) {
                const matchingAttachments = this.attachments.filter(attachment => attachment.hasTrait(trait));
                illegalAttachments = illegalAttachments.concat(matchingAttachments.slice(0, -object[trait]));
            }
        }
        illegalAttachments = _.uniq(illegalAttachments);
        if(this.attachments.filter(card => card.isRestricted()).length > 2) {
            this.game.promptForSelect(this.controller, {
                activePromptTitle: 'Choose an attachment to discard',
                waitingPromptTitle: 'Waiting for opponent to choose an attachment to discard',
                controller: Players.Self,
                cardCondition: card => card.parent === this && card.isRestricted(),
                onSelect: (player, card) => {
                    this.game.addMessage('{0} discards {1} from {2} due to too many Restricted attachments', player, card, card.parent);
                    if(illegalAttachments.length > 0) {
                        this.game.addMessage('{0} {1} discarded from {3} as {2} {1} no longer legally attached', illegalAttachments, illegalAttachments.length > 1 ? 'are' : 'is', illegalAttachments.length > 1 ? 'they' : 'it', this);
                    }
                    if(!illegalAttachments.includes(card)) {
                        illegalAttachments.push(card);
                    }
                    this.game.applyGameAction(context, { discardFromPlay: illegalAttachments });
                    return true;
                },
                source: 'Too many Restricted attachments'
            });
            return true;
        } else if(illegalAttachments.length > 0) {
            this.game.addMessage('{0} {1} discarded from {3} as {2} {1} no longer legally attached', illegalAttachments, illegalAttachments.length > 1 ? 'are' : 'is', illegalAttachments.length > 1 ? 'they' : 'it', this);
            this.game.applyGameAction(context, { discardFromPlay: illegalAttachments });
            return true;
        }
        return false;
    }

    mustAttachToRing() {
        return false;
    }

    /**
     * Checks whether an attachment can be played on a given card.  Intended to be
     * used by cards inheriting this class
     */
    canPlayOn(card) { // eslint-disable-line no-unused-vars
        return true;
    }

    /**
     * Checks 'no attachment' restrictions for this card when attempting to
     * attach the passed attachment card.
     */
    allowAttachment(attachment) {
        if(_.any(this.allowedAttachmentTraits, trait => attachment.hasTrait(trait))) {
            return true;
        }

        return (
            this.isBlank() ||
            this.allowedAttachmentTraits.length === 0
        );
    }

    /**
     * Applies an effect with the specified properties while the current card is
     * attached to another card. By default the effect will target the parent
     * card, but you can provide a match function to narrow down whether the
     * effect is applied (for cases where the effect only applies to specific
     * characters).
     */
    whileAttached(properties) {
        this.persistentEffect({
            condition: properties.condition || (() => true),
            match: (card, context) => card === this.parent && (!properties.match || properties.match(card, context)),
            targetController: Players.Any,
            effect: properties.effect
        });
    }

    /**
     * Checks whether the passed card meets the attachment restrictions (e.g.
     * Opponent cards only, specific factions, etc) for this card.
     */
    canAttach(parent, context, ignoreType = false) {
        if(!parent || parent.getType() !== CardTypes.Character || !ignoreType && this.getType() !== CardTypes.Attachment) {
            return false;
        }
        if(this.anyEffect(EffectNames.AttachmentMyControlOnly) && context.player !== parent.controller && this.controller !== parent.controller) {
            return false;
        } else if(this.anyEffect(EffectNames.AttachmentUniqueRestriction) && !parent.isUnique()) {
            return false;
        } else if(this.getEffects(EffectNames.AttachmentFactionRestriction).some(factions => !factions.some(faction => parent.isFaction(faction)))) {
            return false;
        } else if(this.getEffects(EffectNames.AttachmentTraitRestriction).some(traits => !traits.some(trait => parent.hasTrait(trait)))) {
            return false;
        }
        return true;
    }

    getPlayActions() {
        if(this.type === CardTypes.Event) {
            return this.getActions();
        }
        let actions = this.abilities.playActions.slice();
        if(this.type === CardTypes.Character) {
            if(this.disguisedKeywordTraits.length > 0) {
                actions.push(new PlayDisguisedCharacterAction(this));
            }
            if(this.isDynasty) {
                actions.push(new DynastyCardAction(this));
            } else {
                actions.push(new PlayCharacterAction(this));
            }
        } else if(this.type === CardTypes.Attachment && this.mustAttachToRing()) {
            actions.push(new PlayAttachmentOnRingAction(this));
        } else if(this.type === CardTypes.Attachment) {
            actions.push(new PlayAttachmentAction(this));
        }
        return actions;
    }

    /**
     * This removes an attachment from this card's attachment Array.  It doesn't open any windows for
     * game effects to respond to.
     * @param {DrawCard} attachment
     */
    removeAttachment(attachment) {
        this.attachments = _(this.attachments.reject(card => card.uuid === attachment.uuid));
    }

    addChildCard(card, location) {
        this.childCards.push(card);
        this.controller.moveCard(card, location);
    }

    removeChildCard(card, location) {
        if(!card) {
            return;
        }

        this.childCards = this.childCards.filter(a => a !== card);
        this.controller.moveCard(card, location);
    }

    getShortSummaryForControls(activePlayer) {
        if(this.facedown && (activePlayer !== this.controller || this.hideWhenFacedown())) {
            return { facedown: true, isDynasty: this.isDynasty, isConflict: this.isConflict };
        }
        return super.getShortSummaryForControls(activePlayer);
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let isActivePlayer = activePlayer === this.controller;
        let selectionState = activePlayer.getCardSelectionState(this);

        // This is my facedown card, but I'm not allowed to look at it
        // OR This is not my card, and it's either facedown or hidden from me
        if(isActivePlayer ? this.facedown && this.hideWhenFacedown() : (this.facedown || hideWhenFaceup || this.anyEffect(EffectNames.HideWhenFaceUp))) {
            let state = {
                controller: this.controller.getShortSummary(),
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
