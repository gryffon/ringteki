const uuid = require('uuid');
const _ = require('underscore');

const AbilityDsl = require('./abilitydsl.js');
const CardAction = require('./cardaction.js');
const CardForcedInterrupt = require('./cardforcedinterrupt.js');
const CardForcedReaction = require('./cardforcedreaction.js');
const CardInterrupt = require('./cardinterrupt.js');
const CardReaction = require('./cardreaction.js');
const CustomPlayAction = require('./customplayaction.js');
const EffectSource = require('./EffectSource.js');
const EventRegistrar = require('./eventregistrar.js');

const ValidKeywords = [
    'ancestral',
    'restricted',
    'limited',
    'sincerity',
    'courtesy',
    'pride',
    'covert'
];
const LocationsWithEventHandling = ['play area', 'province'];

class BaseCard extends EffectSource {
    constructor(owner, cardData) {
        super(owner.game);
        this.owner = owner;
        this.controller = owner;
        this.cardData = cardData;

        this.uuid = uuid.v1();
        this.id = cardData.id;
        this.name = cardData.name;
        this.blankCount = 0;
        this.inConflict = false;

        this.type = cardData.type;

        this.tokens = {};
        this.strongholdModifierValues = {
            honor: 0,
            fate: 0,
            influence: 0,
            strength: 0
        };
        this.canProvideStrongholdModifier = {
            honor: true,
            fate: true,
            influence: true,
            strength: true
        };
        this.provinceModifierValues = {
            strength: 0
        };
        this.canProvideProvinceModifier = {
            strength: true
        };
        this.abilityRestrictions = [];
        this.menu = _([]);

        this.showPopup = false;
        this.popupMenuText = '';

        this.abilities = { actions: [], reactions: [], persistentEffects: [], playActions: [] };
        this.parseKeywords(cardData.text_canonical || '');
        this.parseTraits(cardData.traits || '');
        this.setupCardAbilities(AbilityDsl);

        this.addFaction(cardData.clan);

        this.isProvince = false;
        this.isConflict = false;
        this.isDynasty = false;
        this.isStronghold = false;
    }

    parseKeywords(text) {
        var lines = text.split('\n');
        var potentialKeywords = [];
        _.each(lines, line => {
            line = line.slice(0, -1);
            _.each(line.split('. '), k => potentialKeywords.push(k));
        });

        this.keywords = {};
        this.printedKeywords = [];
        this.allowedAttachmentTraits = [];

        _.each(potentialKeywords, keyword => {
            if(_.contains(ValidKeywords, keyword)) {
                this.printedKeywords.push(keyword);
            } else if(keyword.startsWith('no attachments except')) {
                var traits = keyword.replace('no attachments except ', '');
                this.allowedAttachmentTraits = traits.split(' or ');
            } else if(keyword.startsWith('no attachments')) {
                this.allowedAttachmentTraits = ['none'];
            }
        });

        if(this.printedKeywords.length > 0) {
            this.persistentEffect({
                match: this,
                effect: AbilityDsl.effects.addMultipleKeywords(this.printedKeywords)
            });
        }
    }

    parseTraits(traits) {
        this.traits = {};

        _.each(traits, trait => this.addTrait(trait));
    }

    registerEvents(events) {
        this.eventsForRegistration = events;
    }

    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
    }

    provinceModifiers(modifiers) {
        this.provincetModifierValues = _.extend(this.provinceModifierValues, modifiers);
        if(modifiers.strength) {
            this.persistentEffect({
                condition: () => this.canProvideProvinceModifier['strength'],
                match: card => card.controller.activeProvince === card,
                targetController: 'current',
                effect: AbilityDsl.effects.modifyStrength(modifiers.strength)
            });
        }
    }

    action(properties) {
        var action = new CardAction(this.game, this, properties);
        /*
        if(!action.isClickToActivate() && action.allowMenu()) {
            var index = this.abilities.actions.length;
            this.menu.push(action.getMenuItem(index));
        }*/
        this.abilities.actions.push(action);
    }

    reaction(properties) {
        var reaction = new CardReaction(this.game, this, properties);
        this.abilities.reactions.push(reaction);
    }

    forcedReaction(properties) {
        var reaction = new CardForcedReaction(this.game, this, properties);
        this.abilities.reactions.push(reaction);
    }

    interrupt(properties) {
        var reaction = new CardInterrupt(this.game, this, properties);
        this.abilities.reactions.push(reaction);
    }

    forcedInterrupt(properties) {
        var reaction = new CardForcedInterrupt(this.game, this, properties);
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

    doAction(player, arg) {
        var action = this.abilities.actions[arg];

        if(!action) {
            return;
        }

        action.execute(player, arg);
    }

    hasKeyword(keyword) {
        var keywordCount = this.keywords[keyword.toLowerCase()] || 0;
        return keywordCount > 0;
    }

    hasPrintedKeyword(keyword) {
        return this.printedKeywords.includes(keyword.toLowerCase());
    }

    applyAnyLocationPersistentEffects() {
        _.each(this.abilities.persistentEffects, effect => {
            if(effect.location === 'any') {
                this.game.addEffect(this, effect);
            }
        });
    }

    applyPersistentEffects() {
        _.each(this.abilities.persistentEffects, effect => {
            if(effect.location !== 'any') {
                this.game.addEffect(this, effect);
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

    getDefaultLocation(location) {
        if(location.includes('province')) {
            return location.concat('province 1', 'province 2', 'province 3', 'province 4', 'stronghold province');
        }
        return location;
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

            this.game.raiseEvent('onCardMoved', { card: this, originalLocation: originalLocation, newLocation: targetLocation });
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
        return this.blankCount > 0;
    }

    getPrintedFaction() {
        return this.cardData.clan;
    }

    setBlank() {
        var before = this.isBlank();
        this.blankCount++;
        var after = this.isBlank();
        if(!before && after) {
            this.game.emitEvent('onCardBlankToggled', { card: this, isBlank: after });
        }
    }

    allowGameAction(actionType, context = null) {
        return (!_.any(this.abilityRestrictions, restriction => restriction.isMatch(actionType, context)) &&
            this.controller.allowGameAction(actionType, context));
    }

    allowEffectFrom(source) {
        let context = { game: this.game, player: source.controller, source: source, stage: 'effect' };
        return !_.any(this.abilityRestrictions, restriction => restriction.isMatch('applyEffect', context));
    }

    addAbilityRestriction(restriction) {
        this.abilityRestrictions.push(restriction);
    }

    removeAbilityRestriction(restriction) {
        this.abilityRestrictions = _.reject(this.abilityRestrictions, r => r === restriction);
    }

    addKeyword(keyword) {
        var lowerCaseKeyword = keyword.toLowerCase();
        this.keywords[lowerCaseKeyword] = this.keywords[lowerCaseKeyword] || 0;
        this.keywords[lowerCaseKeyword]++;
    }

    addTrait(trait) {
        let lowerCaseTrait = trait.toLowerCase();

        if(!lowerCaseTrait || lowerCaseTrait === '') {
            return;
        }

        if(!this.traits[lowerCaseTrait]) {
            this.traits[lowerCaseTrait] = 1;
        } else {
            this.traits[lowerCaseTrait]++;
        }
    }

    addFaction(faction) {
        if(!faction) {
            return;
        }

        var lowerCaseFaction = faction.toLowerCase();
        this.factions[lowerCaseFaction] = this.factions[lowerCaseFaction] || 0;
        this.factions[lowerCaseFaction]++;
    }

    removeKeyword(keyword) {
        var lowerCaseKeyword = keyword.toLowerCase();
        this.keywords[lowerCaseKeyword] = this.keywords[lowerCaseKeyword] || 0;
        this.keywords[lowerCaseKeyword]--;
    }

    removeTrait(trait) {
        let lowerCaseTrait = trait.toLowerCase();
        this.traits[lowerCaseTrait] = this.traits[lowerCaseTrait] || 0;
        this.traits[lowerCaseTrait]--;
    }

    removeFaction(faction) {
        this.factions[faction.toLowerCase()]--;
    }

    clearBlank() {
        var before = this.isBlank();
        this.blankCount--;
        var after = this.isBlank();
        if(before && !after) {
            this.game.emitEvent('onCardBlankToggled', { card: this, isBlank: after });
        }
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

        return _.extend(state, selectionState);
    }
}

module.exports = BaseCard;
