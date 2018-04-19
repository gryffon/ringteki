const _ = require('underscore');

const AbilityDsl = require('./abilitydsl.js');
const BaseCard = require('./basecard.js');
const DynastyCardAction = require('./dynastycardaction.js');
const PlayCardAction = require('./playcardaction.js');
const PlayAttachmentAction = require('./playattachmentaction.js');
const PlayCharacterAction = require('./playcharacteraction.js');
const DuplicateUniqueAction = require('./duplicateuniqueaction.js');
const CourtesyAbility = require('./KeywordAbilities/CourtesyAbility');
const PersonalHonorAbility = require('./KeywordAbilities/PersonalHonorAbility');
const PrideAbility = require('./KeywordAbilities/PrideAbility');
const SincerityAbility = require('./KeywordAbilities/SincerityAbility');

const StandardPlayActions = [
    new DynastyCardAction(),
    new PlayAttachmentAction(),
    new PlayCharacterAction(),
    new DuplicateUniqueAction(),
    new PlayCardAction()
];

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

        this.printedMilitarySkill = cardData.military;
        this.printedPoliticalSkill = cardData.political;
        this.fate = 0;
        this.bowed = false;
        this.covert = false;
        this.isConflict = cardData.side === 'conflict';
        this.isDynasty = cardData.side === 'dynasty';
        this.isHonored = false;
        this.isDishonored = false;

        this.parseKeywords(cardData.text_canonical || '');

        this.menu = _([
            { command: 'bow', text: 'Bow/Ready' },
            { command: 'honor', text: 'Honor' },
            { command: 'dishonor', text: 'Dishonor' },
            { command: 'addfate', text: 'Add 1 fate' },
            { command: 'remfate', text: 'Remove 1 fate' },
            { command: 'move', text: 'Move into/out of conflict' },
            { command: 'control', text: 'Give control' }
        ]);

        if(cardData.type === 'character') {
            this.abilities.reactions.push(new CourtesyAbility(this.game, this));
            this.abilities.reactions.push(new PersonalHonorAbility(this.game, this));
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
                match: this,
                effect: AbilityDsl.effects.addKeyword(keyword)
            });
        });
    }


    hasKeyword(keyword) {
        return this.getEffects('addKeyword').includes(keyword.toLowerCase());
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
        return this.cardData.cost;
    }

    getFate() {
        return this.fate;
    }
    
    allowGameAction(actionType, context = null) {
        if(actionType === 'break') {
            return false;
        } else if(actionType === 'dishonor') {
            if(this.location !== 'play area' || this.type !== 'character' || this.isDishonored || 
               (!super.allowGameAction('becomeDishonored', context) && !this.isHonored)) {
                return false;
            }
        } else if(actionType === 'honor' && (this.location !== 'play area' || this.type !== 'character' || this.isHonored)) {
            return false;
        } else if(actionType === 'bow' && (['event', 'holding'].includes(this.type) || this.location !== 'play area' || this.bowed)) {
            return false;
        } else if(actionType === 'ready' && (['event', 'holding'].includes(this.type) || this.location !== 'play area' || !this.bowed)) {
            return false;
        } else if(actionType === 'moveToConflict') {
            if(!this.game.currentConflict || this.isParticipating() || this.type !== 'character') {
                return false;
            }
            if(this.controller.isAttackingPlayer()) {
                if(!this.canParticipateAsAttacker()) {
                    return false;
                }
            } else if(!this.canParticipateAsDefender()) {
                return false;
            }
        } else if(actionType === 'sendHome' && !this.isParticipating()) {
            return false;
        } else if(actionType === 'putIntoConflict') {
            // There is no current conflict, or no context (cards must be put into play by a player, not a framework event)
            if(!this.game.currentConflict || !context || !this.allowGameAction('putIntoPlay', context)) {
                return false;
            }
            // controller is attacking, and character can't attack, or controller is defending, and character can't defend
            if((context.player.isAttackingPlayer() && !this.allowGameAction('participateAsAttacker')) || 
                (context.player.isDefendingPlayer() && !this.allowGameAction('participateAsDefender'))) {
                return false;
            }
            // card cannot participate in this conflict type
            if(this.hasDash(this.game.currentConflict.type)) {
                return false;
            }
        } else if(actionType === 'putIntoPlay') {
            if(this.location === 'play area' || this.facedown || !['character', 'attachment'].includes(this.type)) {
                return false;
            }
            if(this.isUnique() && this.game.allCards.any(card => (
                card.location === 'play area' &&
                card.name === this.name &&
                ((card.owner === context.player || card.controller === context.player) || (card.owner === this.owner)) &&
                card !== this
            ))) {
                return false;
            }
        } else if(actionType === 'removeFate' && (this.location !== 'play area' || this.fate === 0 || this.type !== 'character')) {
            return false;
        } else if(actionType === 'sacrifice' && ((['character', 'attachment'].includes(this.type) && this.location !== 'play area') || this.facedown)) {
            return false;
        } else if(['discardFromPlay', 'returnToHand', 'returnToDeck', 'takeControl', 'placeFate'].includes(actionType) && this.location !== 'play area') {
            return false;
        }
        return super.allowGameAction(actionType, context);
    }

    createSnapshot() {
        let clone = new DrawCard(this.owner, this.cardData);

        clone.attachments = _(this.attachments.map(attachment => attachment.createSnapshot()));
        clone.effects = _.clone(this.effects);
        clone.controller = this.controller;
        clone.bowed = this.bowed;
        clone.isHonored = this.isHonored;
        clone.isDishonored = this.isDishonored;
        clone.location = this.location;
        clone.parent = this.parent;
        clone.fate = this.fate;
        clone.inConflict = this.inConflict;
        return clone;
    }

    hasDash(type = '') {
        let dashEffects = this.getEffects('setDash');
        if(type === 'military') {
            return this.printedMilitarySkill === null || dashEffects.includes(type);
        } else if(type === 'political') {
            return this.printedPoliticalSkill === null || dashEffects.includes(type);            
        }
        return this.printedMilitarySkill === null || this.printedPoliticalSkill === null || dashEffects.length > 0;
    }

    getSkill(type, printed = false) {
        /**
         * Direct the skill query to the correct sub function.
         * @param  {string} type - The type of the skill; military or political
         * @param  {boolean} printed - Use the printed value of the skill; default false
         * @return {integer} The chosen skill value
         */
        if(type === 'military') {
            return this.getMilitarySkill(printed);
        } else if(type === 'political') {
            return this.getPoliticalSkill(printed);
        }
    }

    getGlory() {
        /**
         * Get this card's glory.
         * @return {integer} The military skill value
         */
        let gloryEffects = this.getEffects('modifyGlory');
        if(this.cardData.glory !== null && this.cardData.glory !== undefined) {
            return Math.max(0, gloryEffects.reduce((total, value) => total + value, this.cardData.glory));
        }
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
        /**
         * Get the military skill.
         * @param  {boolean} floor - Return the value after flooring it at 0; default false
         * @return {integer} The military skill value
         */

        if(this.hasDash('military')) {
            return 0;
        }

        // get base mill skill + effect modifiers
        let skill = this.getEffects('modifyMilitarySkill').reduce((total, value) => total + value, this.getBaseMilitarySkill());
        // add attachment bonuses and skill from glory
        skill = this.getSkillFromGlory() + this.attachments.reduce((total, card) => {
            let bonus = parseInt(card.cardData.military_bonus);
            return bonus ? total + bonus : total;
        }, skill);
        // multiply total
        skill = this.getEffects('modifyMilitarySkillMultiplier').reduce((total, effect) => total * effect.value, skill);
        return floor ? Math.max(0, skill) : skill;
    }

    get politicalSkill() {
        return this.getPoliticalSkill();
    }

    getPoliticalSkill(floor = true) {
        /**
         * Get the political skill.
         * @param  {boolean} printed - Use the printed value of the skill; default false
         * @param  {boolean} floor - Return the value after flooring it at 0; default false
         * @return {integer} The political skill value
         */
        if(this.hasDash('political')) {
            return 0;
        }

        // get base mill skill + effect modifiers
        let skill = this.getEffects('modifyPoliticalSkill').reduce((total, value) => total + value, this.getBasePoliticalSkill());
        // add attachment bonuses and skill from glory
        skill = this.getSkillFromGlory() + this.attachments.reduce((total, card) => {
            let bonus = parseInt(card.cardData.political_bonus);
            return bonus ? total + bonus : total;
        }, skill);
        // multiply total
        skill = this.getEffects('modifyPoliticalSkillMultiplier').reduce((total, effect) => total * effect.value, skill);
        return floor ? Math.max(0, skill) : skill;
    }

    getBaseMilitarySkill() {
        if(this.hasDash('military')) {
            return 0;
        }

        return this.getEffects('modifyBaseMilitarySkill').reduce((total, value) => total + value, this.printedMilitarySkill);
    }
    
    getBasePoliticalSkill() {
        if(this.hasDash('political')) {
            return 0;
        }

        return this.getEffects('modifyBasePoliticalSkill').reduce((total, value) => total + value, this.printedPoliticalSkill);
    }

    getSkillFromGlory() {
        if(!this.allowGameAction('affectedByHonor')) {
            return 0;
        }
        if(this.isHonored) {
            return this.getGlory();
        } else if(this.isDishonored) {
            return 0 - this.getGlory();
        }
        return 0;
    }

    modifyFate(amount) {
        /**
         * @param  {Number} amount - the amount of fate to modify this card's fate total by
         */
        this.fate = Math.max(0, this.fate + amount);
    }

    honor() {
        if(this.isDishonored) {
            this.isDishonored = false;
            return true;
        } else if(!this.isHonored) {
            this.isHonored = true;
            return true;
        }
        return false;
    }

    dishonor() {
        if(!this.allowGameAction('dishonor')) {
            return false;
        }
        if(this.isHonored) {
            this.isHonored = false;
            return true;
        } else if(!this.isDishonored) {
            this.isDishonored = true;
            return true;
        }
        return false;
    }

    bow() {
        if(this.allowGameAction('bow')) {
            this.bowed = true;
            return true;
        }
        return false;
    }

    ready() {
        if(this.allowGameAction('ready')) {
            this.bowed = false;
            return true;
        }
        return false;
    }

    needsCovertTarget() {
        return this.isCovert() && !this.covertTarget;
    }

    canUseCovertToBypass(targetCard) {
        return this.isCovert() && targetCard.canBeBypassedByCovert();
    }

    canBeBypassedByCovert() {
        return !this.isCovert() && this.type === 'character' && this.location === 'play area';
    }

    useCovertToBypass(targetCard) {
        if(!this.canUseCovertToBypass(targetCard)) {
            return false;
        }

        targetCard.covert = true;
        this.covertTarget = targetCard;

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
            targetController: 'any',
            effect: properties.effect
        });
    }

    /**
     * Checks whether the passed card meets the attachment restrictions (e.g.
     * Opponent cards only, specific factions, etc) for this card.
     */
    canAttach(card) {
        return card && card.getType() === 'character' && this.getType() === 'attachment';
    }

    canPlay(context) {
        return this.allowGameAction('play', context);
    }

    /**
     * Checks whether an attachment can be played on a given card.  Intended to be
     * used by cards inheriting this class
     */
    canPlayOn(card) { // eslint-disable-line no-unused-vars
        return true;
    }

    checkForIllegalAttachments() {
        let illegalAttachments = this.attachments.reject(attachment => this.allowAttachment(attachment) && attachment.canAttach(this));
        if(illegalAttachments.length > 0) {
            this.game.addMessage('{0} {1} discarded from {2} as it is no longer legally attached', illegalAttachments, illegalAttachments.length > 1 ? 'are' : 'is', this);
            this.game.applyGameAction(null, { discardFromPlay: illegalAttachments });
            return true;
        }
        return false;
    }

    getActions() {
        return StandardPlayActions
            .concat(this.abilities.playActions)
            .concat(super.getActions());
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

        this.isDishonored = false;
        this.isHonored = false;
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
    
    isAttacking() {
        return this.game.currentConflict && this.game.currentConflict.isAttacking(this);
    }

    isDefending() {
        return this.game.currentConflict && this.game.currentConflict.isDefending(this);
    }

    isParticipating() {
        return this.game.currentConflict && this.game.currentConflict.isParticipating(this);
    }

    canDeclareAsAttacker(conflictType = this.game.currentConflict.type) {
        return (this.allowGameAction('declareAsAttacker') && !this.bowed && 
                this.canParticipateAsAttacker(conflictType));
    }

    canDeclareAsDefender(conflictType = this.game.currentConflict.type) {
        return (this.allowGameAction('declareAsDefender') && this.canParticipateAsDefender(conflictType) && 
                !this.bowed && !this.covert);
    }

    canParticipateInConflict(conflictType = this.game.currentConflict.type) {
        return this.location === 'play area' && !this.hasDash(conflictType);
    }

    canParticipateAsAttacker(conflictType = this.game.currentConflict.type) {
        return this.allowGameAction('participateAsAttacker') && this.canParticipateInConflict(conflictType);
    }

    canParticipateAsDefender(conflictType = this.game.currentConflict.type) {
        return this.allowGameAction('participateAsDefender') && this.canParticipateInConflict(conflictType);
    }

    bowsOnReturnHome() {
        return this.getEffects('doesNotBow').length === 0;
    }

    readiesDuringReadyPhase() {
        return this.getEffects('doesNotReady').length > 0;
    }

    getModifiedLimitMax(max) {
        return this.getEffects('increaseLimitOnAbilities').reduce((total, value) => total + value, max);
    }

    setDefaultController(player) {
        this.defaultController = player;
    }

    getModifiedController() {
        if(this.location === 'play area') {
            return _.last(this.getEffects('takeControl')) || this.defaultController;
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
            bowed: this.bowed,
            fate: this.fate,
            new: this.new,
            covert: this.covert
        });
    }
}

module.exports = DrawCard;
