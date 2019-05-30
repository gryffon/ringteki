const _ = require('underscore');

const AbilityDsl = require('./abilitydsl.js');
const BaseCard = require('./basecard');
const DynastyCardAction = require('./dynastycardaction.js');
const PlayAttachmentAction = require('./playattachmentaction.js');
const PlayCharacterAction = require('./playcharacteraction.js');
const DuplicateUniqueAction = require('./duplicateuniqueaction.js');
const CourtesyAbility = require('./KeywordAbilities/CourtesyAbility');
const PrideAbility = require('./KeywordAbilities/PrideAbility');
const SincerityAbility = require('./KeywordAbilities/SincerityAbility');
const StatusToken = require('./StatusToken');

const { Locations, EffectNames, Players, CardTypes, PlayTypes } = require('./Constants');

const ValidKeywords = [
    'ancestral',
    'restricted',
    'limited',
    'sincerity',
    'courtesy',
    'pride',
    'covert'
];

class DrawCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.defaultController = owner;
        this.attachments = _([]);
        this.parent = null;

        this.printedMilitarySkill = parseInt(cardData.military);
        this.printedPoliticalSkill = parseInt(cardData.political);
        this.printedCost = this.cardData.cost;
        this.fate = 0;
        this.bowed = false;
        this.covert = false;
        this.isConflict = cardData.side === 'conflict';
        this.isDynasty = cardData.side === 'dynasty';
        this.personalHonor = null;

        this.parseKeywords(cardData.text ? cardData.text.replace(/<[^>]*>/g, '').toLowerCase() : '');

        this.menu = _([
            { command: 'bow', text: 'Bow/Ready' },
            { command: 'honor', text: 'Honor' },
            { command: 'dishonor', text: 'Dishonor' },
            { command: 'addfate', text: 'Add 1 fate' },
            { command: 'remfate', text: 'Remove 1 fate' },
            { command: 'move', text: 'Move into/out of conflict' },
            { command: 'control', text: 'Give control' }
        ]);

        if(cardData.type === CardTypes.Character) {
            this.abilities.reactions.push(new CourtesyAbility(this.game, this));
            this.abilities.reactions.push(new PrideAbility(this.game, this));
            this.abilities.reactions.push(new SincerityAbility(this.game, this));
        }
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

        this.printedKeywords.forEach(keyword => {
            this.persistentEffect({
                effect: AbilityDsl.effects.addKeyword(keyword)
            });
        });
    }


    hasKeyword(keyword) {
        return this.getEffects(EffectNames.AddKeyword).includes(keyword.toLowerCase());
    }

    hasPrintedKeyword(keyword) {
        return this.printedKeywords.includes(keyword.toLowerCase());
    }

    isLimited() {
        return this.hasKeyword('Limited') || this.hasPrintedKeyword('Limited');
    }

    isRestricted() {
        return this.hasKeyword('restricted');
    }

    isAncestral() {
        return this.hasKeyword('ancestral');
    }

    isCovert() {
        return this.hasKeyword('covert');
    }

    hasSincerity() {
        return this.hasKeyword('sincerity');
    }

    hasPride() {
        return this.hasKeyword('pride');
    }

    hasCourtesy() {
        return this.hasKeyword('courtesy');
    }

    getCost() {
        let copyEffect = this.mostRecentEffect(EffectNames.CopyCharacter);
        return copyEffect ? copyEffect.printedCost : this.printedCost;
    }

    getFate() {
        return this.fate;
    }

    costLessThan(num) {
        let cost = this.getCost();
        return num && (cost || cost === 0) && cost < num;
    }

    anotherUniqueInPlay(player) {
        return this.isUnique() && this.game.allCards.any(card => (
            card.location === Locations.PlayArea &&
            card.printedName === this.printedName &&
            card !== this &&
            (card.owner === player || card.controller === player || card.owner === this.owner)
        ));
    }

    createSnapshot() {
        let clone = new DrawCard(this.owner, this.cardData);

        clone.attachments = _(this.attachments.map(attachment => attachment.createSnapshot()));
        clone.effects = _.clone(this.effects);
        clone.controller = this.controller;
        clone.bowed = this.bowed;
        clone.personalHonor = this.personalHonor;
        clone.location = this.location;
        clone.parent = this.parent;
        clone.fate = this.fate;
        clone.inConflict = this.inConflict;
        clone.traits = this.getTraits();
        return clone;
    }

    hasDash(type = '') {
        if(type === 'glory') {
            return false;
        }

        if(type === 'military') {
            let modifiers = this.getMilitaryModifiers();
            let skill = modifiers.reduce((total, modifier) => total + modifier.amount, 0);
            return Number.isNaN(skill);
        } else if(type === 'political') {
            let modifiers = this.getPoliticalModifiers();
            let skill = modifiers.reduce((total, modifier) => total + modifier.amount, 0);
            return Number.isNaN(skill);
        }

        let militaryModifiers = this.getMilitaryModifiers();
        let militarySkill = militaryModifiers.reduce((total, modifier) => total + modifier.amount, 0);
        let politicalModifiers = this.getPoliticalModifiers();
        let politicalSkill = politicalModifiers.reduce((total, modifier) => total + modifier.amount, 0);

        return Number.isNaN(militarySkill) || Number.isNaN(politicalSkill);
    }

    getSkill(type) {
        /**
         * Direct the skill query to the correct sub function.
         * @param  {string} type - The type of the skill; military or political
         * @return {integer} The chosen skill value
         */
        if(type === 'military') {
            return this.getMilitarySkill();
        } else if(type === 'political') {
            return this.getPoliticalSkill();
        }
    }

    getMilitaryModifiers() {
        // base dash or copy dash
        let copyEffect = this.mostRecentEffect(EffectNames.CopyCharacter);
        let militarySkill = copyEffect ? copyEffect.printedMilitarySkill : this.printedMilitarySkill;
        if(Number.isNaN(militarySkill)) {
            if(copyEffect) {
                return [{ amount: undefined, display: '-', name: 'base via ' + copyEffect.context.source.name, isBase: true }];
            }
            return [{ amount: undefined, display: '-', name: 'base', isBase: true }];
        }

        // dash effects
        let dashEffects = this.effects.filter(effect => effect.type === EffectNames.SetDash);
        if(dashEffects.includes('military')) {
            return [{ amount: undefined, display: '-', name: '' + dashEffects.map(e => e.context.source.name).join(', '), isBase: true }];
        }

        // set effects
        let setEffects = this.effects.filter(effect => effect.type === EffectNames.SetMilitarySkill);
        if(setEffects.length > 0) {
            let latestSetEffect = _.last(setEffects);
            let setAmount = latestSetEffect.getValue(this);
            return [{ amount: setAmount, display: setAmount.toString(), name: 'set by ' + latestSetEffect.context.source.name, isBase: true}];
        }

        let modifiers = [];
        // base
        let setBaseEffects = this.effects.filter(effect => effect.type === EffectNames.SetBaseMilitarySkill);
        if(setBaseEffects.length > 0) {
            let latestSetBaseEffect = _.last(setBaseEffects);
            let setBaseAmount = latestSetBaseEffect.getValue(this);
            modifiers.push({ amount: setBaseAmount, display: setBaseAmount.toString(), name: 'base set by ' + latestSetBaseEffect.context.source.name, isBase: true });
        }

        if(copyEffect) {
            modifiers.push({ amount: militarySkill, display: '-', name: 'base via ' + copyEffect.context.source.name, isBase: true });
        }
        modifiers.push({ amount: militarySkill, display: militarySkill.toString(), name: 'base', isBase: true });

        // base modifiers
        let baseModifierEffects = this.effects.filter(effect => effect.type === EffectNames.ModifyBaseMilitarySkill);
        baseModifierEffects.forEach(baseModifierEffect => {
            const value = baseModifierEffect.getValue(this);
            modifiers.push({ amount: value, display: value.toString(), name: 'to base via ' + baseModifierEffect.context.source.name, isBase: true });
        });

        // skill modifiers
        let modifierEffects = this.effects.filter(effect => effect.type === EffectNames.ModifyMilitarySkill || effect.type === EffectNames.ModifyBothSkills);
        modifierEffects.forEach(modifierEffect => {
            const value = modifierEffect.getValue(this);
            modifiers.push({ amount: value, display: value.toString(), name: '' + modifierEffect.context.source.name, isBase: false });
        });

        // attachment bonus
        let attachmentBonus = this.attachments.reduce((total, card) => {
            let bonus = parseInt(card.cardData.military_bonus);
            return bonus ? total + bonus : total;
        }, 0);
        if(attachmentBonus !== 0) {
            modifiers.push({ amount: attachmentBonus, display: attachmentBonus.toString(), name: 'attachments', isBase: false });
        }

        // skill from glory
        modifiers = modifiers.concat(this.getGloryModifiers());

        // multipliers
        let multiplerEffects = this.effects.filter(effect => effect.type === EffectNames.ModifyMilitarySkillMultiplier);
        multiplerEffects.forEach(multiplierEffect => {
            let multiplier = multiplierEffect.getValue(this);
            let currentTotal = modifiers.reduce((total, modifier) => total + modifier.amount, 0);
            let amount = (multiplier - 1) * currentTotal;
            modifiers.push({ amount: amount, display: amount.toString(), name: '' + multiplierEffect.context.source.name, isBase: false });
        });

        return modifiers;
    }

    getPoliticalModifiers() {
        // base dash or copy dash
        let copyEffect = this.mostRecentEffect(EffectNames.CopyCharacter);
        let politicalSkill = copyEffect ? copyEffect.printedPoliticalSkill : this.printedPoliticalSkill;
        if(Number.isNaN(politicalSkill)) {
            if(copyEffect) {
                return [{ amount: undefined, display: '-', name: 'base via ' + copyEffect.context.source.name, isBase: true }];
            }
            return [{ amount: undefined, display: '-', name: 'base', isBase: true }];
        }

        // dash effects
        let dashEffects = this.effects.filter(effect => effect.type === EffectNames.SetDash);
        if(dashEffects.includes('political')) {
            return [{ amount: undefined, display: '-', name: '' + dashEffects.map(e => e.context.source.name).join(', '), isBase: true }];
        }

        // set effects
        let setEffects = this.effects.filter(effect => effect.type === EffectNames.SetPoliticalSkill);
        if(setEffects.length > 0) {
            let latestSetEffect = _.last(setEffects);
            let setAmount = latestSetEffect.getValue(this);
            return [{ amount: setAmount, display: setAmount.toString(), name: 'set by ' + latestSetEffect.context.source.name, isBase: true }];
        }

        let modifiers = [];
        // base
        let setBaseEffects = this.effects.filter(effect => effect.type === EffectNames.SetBasePoliticalSkill);
        if(setBaseEffects.length > 0) {
            let latestSetBaseEffect = _.last(setBaseEffects);
            let setBaseAmount = latestSetBaseEffect.getValue(this);
            modifiers.push({ amount: setBaseAmount, display: setBaseAmount.toString(), name: 'base set by ' + latestSetBaseEffect.context.source.name, isBase: true });
        }

        if(copyEffect) {
            modifiers.push({ amount: politicalSkill, display: '-', name: 'base via ' + copyEffect.context.source.name, isBase: true });
        }
        modifiers.push({ amount: politicalSkill, display: politicalSkill.toString(), name: 'base', isBase: true });

        // base modifiers
        let baseModifierEffects = this.effects.filter(effect => effect.type === EffectNames.ModifyBasePoliticalSkill);
        baseModifierEffects.forEach(baseModifierEffect => {
            const value = baseModifierEffect.getValue(this);
            modifiers.push({ amount: value, display: value.toString(), name: 'to base via ' + baseModifierEffect.context.source.name, isBase: true });
        });

        // skill modifiers
        let modifierEffects = this.effects.filter(effect => effect.type === EffectNames.ModifyPoliticalSkill || effect.type === EffectNames.ModifyBothSkills);
        modifierEffects.forEach(modifierEffect => {
            const value = modifierEffect.getValue(this);
            modifiers.push({ amount: value, display: value.toString(), name: '' + modifierEffect.context.source.name, isBase: false });
        });

        // attachment bonus
        let attachmentBonus = this.attachments.reduce((total, card) => {
            let bonus = parseInt(card.cardData.political_bonus);
            return bonus ? total + bonus : total;
        }, 0);
        if(attachmentBonus !== 0) {
            modifiers.push({ amount: attachmentBonus, display: attachmentBonus.toString(), name: 'attachments', isBase: false });
        }

        // skill from glory
        modifiers = modifiers.concat(this.getGloryModifiers());

        // multipliers
        let multiplerEffects = this.effects.filter(effect => effect.type === EffectNames.ModifyPoliticalSkillMultiplier);
        multiplerEffects.forEach(multiplierEffect => {
            let multiplier = multiplierEffect.getValue(this);
            let currentTotal = modifiers.reduce((total, modifier) => total + modifier.amount, 0);
            let amount = (multiplier - 1) * currentTotal;
            modifiers.push({ amount: amount, display: amount.toString(), name: '' + multiplierEffect.context.source.name, isBase: false });
        });

        return modifiers;
    }

    getGloryModifiers() {
        let modifiers = [];
        if(!this.anyEffect(EffectNames.HonorStatusDoesNotModifySkill)) {
            if(this.isHonored) {
                if(this.anyEffect(EffectNames.HonorStatusReverseModifySkill)) {
                    let amount = 0 - this.getGlory();
                    modifiers.push({ amount: amount, display: amount.toString(), name: 'honored (reversed)', isBase: false });
                }
                let amount = this.getGlory();
                modifiers.push({ amount: amount, display: amount.toString(), name: 'honored', isBase: false });
            } else if(this.isDishonored) {
                if(this.anyEffect(EffectNames.HonorStatusReverseModifySkill)) {
                    let amount = this.getGlory();
                    modifiers.push({ amount: amount, display: amount.toString(), name: 'dishonored (reversed)', isBase: false });
                }
                let amount = 0 - this.getGlory();
                modifiers.push({ amount: amount, display: amount.toString(), name: 'dishonored', isBase: false });
            }
        }
        return modifiers;
    }


    get showStats() {
        return this.location === Locations.PlayArea && this.type === CardTypes.Character;
    }

    get militarySkillSummary() {
        if(!this.showStats) {
            return;
        }
        let modifiers = this.getMilitaryModifiers();
        let skill = modifiers.reduce((total, modifier) => total + modifier.amount, 0);
        return {
            skill: Number.isNaN(skill) ? '-' : Math.max(skill, 0).toString(),
            modifiers: modifiers
        };
    }

    get politicalSkillSummary() {
        if(!this.showStats) {
            return;
        }
        let modifiers = this.getPoliticalModifiers();
        let skill = modifiers.reduce((total, modifier) => total + modifier.amount, 0);
        return {
            skill: Number.isNaN(skill) ? '-' : Math.max(skill, 0).toString(),
            modifiers: modifiers
        };
    }

    get glory() {
        return this.getGlory();
    }

    getGlory() {
        /**
         * Get this card's glory.
         * @return {integer} The military skill value
         */
        if(this.cardData.glory !== null && this.cardData.glory !== undefined) {
            if(this.anyEffect(EffectNames.SetGlory)) {
                return Math.max(0, this.mostRecentEffect(EffectNames.SetGlory));
            }
            let copyEffect = this.mostRecentEffect(EffectNames.CopyCharacter);
            let glory = copyEffect ? copyEffect.getGlory() : this.cardData.glory;
            return Math.max(0, this.sumEffects(EffectNames.ModifyGlory) + glory);
        }
        return 0;
    }

    getProvinceStrengthBonus() {
        if(this.cardData.strength_bonus && !this.facedown) {
            return parseInt(this.cardData.strength_bonus);
        }
        return 0;
    }

    get militarySkill() {
        return this.getMilitarySkill();
    }

    getMilitarySkill(floor = true) {
        let modifiers = this.getMilitaryModifiers();
        let skill = modifiers.reduce((total, modifier) => total + modifier.amount, 0);

        if(Number.isNaN(skill)) {
            return 0;
        }
        return floor ? Math.max(0, skill) : skill;
    }

    get politicalSkill() {
        return this.getPoliticalSkill();
    }

    getPoliticalSkill(floor = true) {
        let modifiers = this.getPoliticalModifiers();
        let skill = modifiers.reduce((total, modifier) => total + modifier.amount, 0);

        if(Number.isNaN(skill)) {
            return 0;
        }
        return floor ? Math.max(0, skill) : skill;
    }

    get baseMilitarySkill() {
        return this.getBaseMilitarySkill();
    }

    getBaseMilitarySkill() {
        let modifiers = this.getMilitaryModifiers().filter(modifier => modifier.isBase);
        let skill = modifiers.reduce((total, modifier) => total + modifier.amount, 0);

        if(this.isNaN(skill)) {
            return 0;
        }
        return Math.max(0, skill);
    }

    get basePoliticalSkill() {
        return this.getBasePoliticalSkill();
    }

    getBasePoliticalSkill() {
        let modifiers = this.getPoliticalModifiers().filter(modifier => modifier.isBase);
        let skill = modifiers.reduce((total, modifier) => total + modifier.amount, 0);

        if(this.isNaN(skill)) {
            return 0;
        }
        return Math.max(0, skill);
    }

    getContributionToImperialFavor() {
        return !this.bowed ? this.glory : 0;
    }

    modifyFate(amount) {
        /**
         * @param  {Number} amount - the amount of fate to modify this card's fate total by
         */
        this.fate = Math.max(0, this.fate + amount);
    }

    setPersonalHonor(token) {
        this.personalHonor = token || null;
    }

    get isHonored() {
        return !!this.personalHonor && !!this.personalHonor.honored;
    }

    honor() {
        if(this.isDishonored) {
            this.makeOrdinary();
        } else {
            this.setPersonalHonor(new StatusToken(this.game, this, true));
        }
    }

    get isDishonored() {
        return !!this.personalHonor && !!this.personalHonor.dishonored;
    }

    dishonor() {
        if(this.isHonored) {
            this.makeOrdinary();
        } else {
            this.setPersonalHonor(new StatusToken(this.game, this, false));
        }
    }

    makeOrdinary() {
        this.setPersonalHonor();
    }

    bow() {
        this.bowed = true;
    }

    ready() {
        this.bowed = false;
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
    canAttach(card, context) { // eslint-disable-line no-unused-vars
        return card && card.getType() === CardTypes.Character && this.getType() === CardTypes.Attachment;
    }

    canPlay(context, type) {
        return this.checkRestrictions(type, context) && context.player.checkRestrictions(type, context);
    }

    /**
     * Checks whether an attachment can be played on a given card.  Intended to be
     * used by cards inheriting this class
     */
    canPlayOn(card) { // eslint-disable-line no-unused-vars
        return true;
    }

    checkForIllegalAttachments() {
        let context = this.game.getFrameworkContext(this.controller);
        let illegalAttachments = this.attachments.filter(attachment => (
            !this.allowAttachment(attachment) || !attachment.canAttach(this, { game: this.game, player: this.controller })
        ));
        for(const effectCard of this.getEffects(EffectNames.CannotHaveOtherRestrictedAttachments)) {
            illegalAttachments = illegalAttachments.concat(this.attachments.filter(card => card.isRestricted() && card !== effectCard));
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
                        this.game.addMessage('{0} {1} discarded from {2} as it is no longer legally attached', illegalAttachments, illegalAttachments.length > 1 ? 'are' : 'is', this);
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
            this.game.addMessage('{0} {1} discarded from {2} as it is no longer legally attached', illegalAttachments, illegalAttachments.length > 1 ? 'are' : 'is', this);
            this.game.applyGameAction(null, { discardFromPlay: illegalAttachments});
            return true;
        }
        return false;
    }

    getActions(location = this.location) {
        if(location === Locations.PlayArea || this.type === CardTypes.Event) {
            return super.getActions();
        }
        const actions = this.type === CardTypes.Character ? [new DuplicateUniqueAction(this)] : [];
        return actions.concat(this.getPlayActions(), super.getActions());
    }

    getPlayActions() {
        if(this.type === CardTypes.Event) {
            return super.getActions();
        }
        let actions = this.abilities.playActions.slice();
        if(this.type === CardTypes.Character) {
            if(this.isDynasty) {
                actions.push(new DynastyCardAction(this));
            } else {
                actions.push(new PlayCharacterAction(this));
            }
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

    /**
     * Deals with the engine effects of leaving play, making sure all statuses are removed. Anything which changes
     * the state of the card should be here. This is also called in some strange corner cases e.g. for attachments
     * which aren't actually in play themselves when their parent (which is in play) leaves play.
     */
    leavesPlay() {
        // If this is an attachment and is attached to another card, we need to remove all links between them
        if(this.parent && this.parent.attachments) {
            this.parent.removeAttachment(this);
            this.parent = null;
        }

        if(this.isParticipating()) {
            this.game.currentConflict.removeFromConflict(this);
        }

        if(this.isDishonored && !this.anyEffect(EffectNames.HonorStatusDoesNotAffectLeavePlay)) {
            this.game.addMessage('{0} loses 1 honor due to {1}\'s personal honor', this.controller, this);
            this.game.openThenEventWindow(this.game.actions.loseHonor().getEvent(this.controller, this.game.getFrameworkContext()));
        } else if(this.isHonored && !this.anyEffect(EffectNames.HonorStatusDoesNotAffectLeavePlay)) {
            this.game.addMessage('{0} gains 1 honor due to {1}\'s personal honor', this.controller, this);
            this.game.openThenEventWindow(this.game.actions.gainHonor().getEvent(this.controller, this.game.getFrameworkContext()));
        }

        this.makeOrdinary();
        this.bowed = false;
        this.covert = false;
        this.new = false;
        this.fate = 0;
        super.leavesPlay();
    }

    resetForConflict() {
        this.covert = false;
        this.inConflict = false;
    }

    canBeBypassedByCovert(context) {
        return !this.isCovert() && this.checkRestrictions('applyCovert', context);
    }

    canDeclareAsAttacker(conflictType, ring, province) { // eslint-disable-line no-unused-vars
        if(this.anyEffect(EffectNames.CanOnlyBeDeclaredAsAttackerWithElement)) {
            const elementsAdded = this.attachments.reduce(
                (array, attachment) => array.concat(attachment.getEffects(EffectNames.AddElementAsAttacker)),
                this.getEffects(EffectNames.AddElementAsAttacker)
            );
            for(let element of this.getEffects(EffectNames.CanOnlyBeDeclaredAsAttackerWithElement)) {
                if(!ring.hasElement(element) && !elementsAdded.includes(element)) {
                    return false;
                }
            }
        }
        return this.checkRestrictions('declareAsAttacker', this.game.getFrameworkContext()) &&
            this.canParticipateAsAttacker(conflictType) &&
            this.location === Locations.PlayArea && !this.bowed;
    }

    canDeclareAsDefender(conflictType = this.game.currentConflict.conflictType) {
        return (this.checkRestrictions('declareAsDefender', this.game.getFrameworkContext()) && this.canParticipateAsDefender(conflictType) &&
                this.location === Locations.PlayArea && !this.bowed && !this.covert);
    }

    canParticipateAsAttacker(conflictType = this.game.currentConflict.conflictType) {
        let effects = this.getEffects(EffectNames.CannotParticipateAsAttacker);
        return !effects.some(value => value === 'both' || value === conflictType) && !this.hasDash(conflictType);
    }

    canParticipateAsDefender(conflictType = this.game.currentConflict.conflictType) {
        let effects = this.getEffects(EffectNames.CannotParticipateAsDefender);
        return !effects.some(value => value === 'both' || value === conflictType) && !this.hasDash(conflictType);
    }

    bowsOnReturnHome() {
        return !this.anyEffect(EffectNames.DoesNotBow);
    }

    setDefaultController(player) {
        this.defaultController = player;
    }

    getModifiedController() {
        if(this.location === Locations.PlayArea) {
            return this.mostRecentEffect(EffectNames.TakeControl) || this.defaultController;
        }
        return this.owner;
    }

    play() {
    //empty function so playcardaction doesn't crash the game
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let baseSummary = super.getSummary(activePlayer, hideWhenFaceup);

        return _.extend(baseSummary, {
            attached: !!this.parent,
            attachments: this.attachments.map(attachment => {
                return attachment.getSummary(activePlayer, hideWhenFaceup);
            }),
            inConflict: this.inConflict,
            isConflict: this.isConflict,
            isDynasty: this.isDynasty,
            isDishonored: this.isDishonored,
            isHonored: this.isHonored,
            isPlayableByMe: this.isConflict && this.controller.isCardInPlayableLocation(this, PlayTypes.PlayFromHand),
            isPlayableByOpponent: this.isConflict && this.controller.opponent && this.controller.opponent.isCardInPlayableLocation(this, PlayTypes.PlayFromHand),
            bowed: this.bowed,
            fate: this.fate,
            new: this.new,
            covert: this.covert,
            showStats: this.showStats,
            militarySkillSummary: this.militarySkillSummary,
            politicalSkillSummary: this.politicalSkillSummary
        });
    }
}

module.exports = DrawCard;
