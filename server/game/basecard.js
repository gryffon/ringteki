const _ = require('underscore');

const AbilityDsl = require('./abilitydsl.js');
const CardAction = require('./cardaction.js');
const CustomPlayAction = require('./customplayaction.js');
const EffectSource = require('./EffectSource.js');
const TriggeredAbility = require('./triggeredability');

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

    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
    }

    action(properties) {
        var action = new CardAction(this.game, this, properties);
        this.abilities.actions.push(action);
    }

    reaction(properties) {
        var reaction = new TriggeredAbility(this.game, this, 'reaction', properties);
        this.abilities.reactions.push(reaction);
    }

    forcedReaction(properties) {
        var reaction = new TriggeredAbility(this.game, this, 'forcedreaction', properties);
        this.abilities.reactions.push(reaction);
    }

    interrupt(properties) {
        var reaction = new TriggeredAbility(this.game, this, properties.canCancel ? 'cancelinterrupt' : 'interrupt', properties);
        this.abilities.reactions.push(reaction);
    }

    forcedInterrupt(properties) {
        var reaction = new TriggeredAbility(this.game, this, 'forcedinterrupt', properties);
        this.abilities.reactions.push(reaction);
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
        const allowedLocations = ['any', 'play area'];
        const defaultLocationForType = {
            province: 'any'
        };

        let location = properties.location || defaultLocationForType[this.getType()] || 'play area';
        if(!allowedLocations.includes(location)) {
            throw new Error(`'${location}' is not a supported effect location.`);
        }

        this.abilities.persistentEffects.push(_.extend({ duration: 'persistent', location: location }, properties));
    }

    hasTrait(trait) {
        trait = trait.toLowerCase();
        return this.traits.includes(trait) || this.getEffects('addTrait').includes(trait);
    }

    getTraits() {
        let traits = this.traits.concat(this.getEffects('addTrait'));
        return _.uniq(traits);
    }

    isFaction(faction) {
        faction = faction.toLowerCase();
        return this.printedFaction === faction || this.getEffects('addFaction').includes(faction);
    }

    applyAnyLocationPersistentEffects() {
        _.each(this.abilities.persistentEffects, effect => {
            if(effect.location === 'any') {
                this.addEffectToEngine(effect);
            }
        });
    }

    applyPersistentEffects() {
        _.each(this.abilities.persistentEffects, effect => {
            if(effect.location !== 'any') {
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
            if(reaction.location.includes(to) && !reaction.location.includes(from)) {
                reaction.registerEvents();
            } else if(!reaction.location.includes(to) && reaction.location.includes(from)) {
                reaction.unregisterEvents();
            }
        });
    }

    moveTo(targetLocation) {
        let originalLocation = this.location;

        this.location = targetLocation;

        if(['play area', 'conflict discard pile', 'dynasty discard pile', 'hand'].includes(targetLocation)) {
            this.facedown = false;
        }

        if(originalLocation !== targetLocation) {
            this.updateAbilityEvents(originalLocation, targetLocation);

            if(targetLocation === 'play area') {
                this.applyPersistentEffects();
            }
            this.game.emitEvent('onCardMoved', { card: this, originalLocation: originalLocation, newLocation: targetLocation });
        }
    }

    modifyFavor(player, glory) {
        return glory;
    }

    canTriggerAbilities(context) {
        return !this.facedown && this.allowGameAction('triggerAbilities', context);
    }
    
    getMenu() {
        var menu = [];

        if(this.menu.isEmpty() || !this.game.manualMode || 
                !['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province','play area'].includes(this.location)) {
            return undefined;
        }
        
        if(this.facedown) {
            return [{ command: 'reveal', text: 'Reveal' }];
        }

        menu.push({ command: 'click', text: 'Select Card' });
        if(this.location === 'play area' || this.isProvince || this.isStronghold) {
            menu = menu.concat(this.menu.value());
        }
        
        return menu;
    }

    isUnique() {
        return this.cardData.unicity;
    }

    isBlank() {
        return this.anyEffect('blank');
    }

    getPrintedFaction() {
        return this.cardData.clan;
    }

    allowGameAction(actionType, context = null) {
        return (!this.getEffects('abilityRestrictions').some(restriction => restriction.isMatch(actionType, context)) &&
            this.controller.allowGameAction(actionType, context));
    }

    allowEffectFrom(source) {
        let abilityRestrictions = this.getEffects('abilityRestrictions');
        let context = { game: this.game, player: source.controller, source: source, stage: 'effect' };
        return !abilityRestrictions.some(restriction => restriction.isMatch('applyEffect', context));
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
        return this.abilities.actions;
    }

    getProvinceStrengthBonus() {
        return 0;
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let isActivePlayer = activePlayer === this.owner;

        if(!isActivePlayer && (this.facedown || hideWhenFaceup) && this.isProvince) {
            return { 
                uuid: this.uuid,
                inConflict: this.inConflict,
                facedown: true};
        }

        if(!isActivePlayer && (this.facedown || hideWhenFaceup)) {
            return { 
                facedown: true};
        }

        let selectionState = activePlayer.getCardSelectionState(this);
        let state = {
            id: this.cardData.id,
            controlled: this.owner !== this.controller,
            inConflict: this.inConflict,
            facedown: this.facedown,
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
