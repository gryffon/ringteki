const _ = require('underscore');

const BaseCard = require('./basecard.js');
const SetupCardAction = require('./setupcardaction.js');
const DynastyCardAction = require('./dynastycardaction.js');
const PlayCardAction = require('./playcardaction.js');
const PlayAttachmentAction = require('./playattachmentaction.js');
const PlayCharacterAction = require('./playcharacteraction.js');
const DuplicateUniqueAction = require('./duplicateuniqueaction.js');

const StandardPlayActions = [
    new SetupCardAction(),
    new DynastyCardAction(),
    new PlayAttachmentAction(),
    new PlayCharacterAction(),
    new DuplicateUniqueAction(),
    new PlayCardAction()
];

class DrawCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.attachments = _([]);
        this.parent = null;

        this.militarySkillModifier = 0;
        this.politicalSkillModifier = 0;
        this.gloryModifier = 0;
        this.fate = 0;
        this.contributesToFavor = true;
        this.bowed = false;
        this.saved = false;
        this.inConflict = false;
        this.isConflict = false;
        this.isDynasty = false;
        this.isHonored = false;
        this.isDishonored = false;
        this.readysDuringReadying = true;
        this.conflictOptions = {
            doesNotBowAs: {
                attacker: false,
                defender: false
            },
            cannotParticipateIn: {
                military: false,
                political: false
            }
        };
        this.covertLimit = 1;

        if(cardData.side === 'conflict') {
            this.isConflict = true;
        } else if(cardData.side === 'dynasty') {
            this.isDynasty = true;
        }
        
        if(cardData.type === 'character') {
            if(cardData.military === undefined || cardData.military === null) {
                this.conflictOptions.cannotParticipateIn.military = true;
            }
            if(cardData.political === undefined || cardData.political === null) {
                this.conflictOptions.cannotParticipateIn.political = true;
            }
        }
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

    modifySkill(amount, type, applying = true) {
        /**
         * Direct the skill modification to the correct sub function.
         * @param  {integer} amount - The amount to modify the skill by.
         * @param  {string}   type - The type of the skill; military or political
         * @param  {boolean}  applying -  [description]
         */
        if(type === 'military') {
            this.modifyMilitarySkill(amount, applying);
        } else if(type === 'political') {
            this.modifyPoliticalSkill(amount, applying);
        }
    }

    modifyGlory(amount, applying = true) {
        /**
         * Modify glory.
         * @param  {integer} amount - The amount to modify glory by.
         * @param  {boolean}  applying -  [description]
         */
        this.gloryModifier += amount;
        this.game.raiseEvent('onCardGloryChanged', {
            card: this,
            amount: amount,
            applying: applying
        });
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
    
    getGlory(printed = false) {
        /**
         * Get this card's glory.
         * @param  {boolean} printed - Use the printed value of the skill; default false
         * @return {integer} The military skill value
         */
        if(printed) {
            return this.cardData.glory;
        }

        if(this.cardData.glory !== null && this.cardData.glory !== undefined) {
            return Math.max(0, this.cardData.glory + this.gloryModifier);
        }

        return null;
       
    }

    modifyMilitarySkill(amount, applying = true) {
        /**
         * Modify the military skill.
         * @param  {integer} amount - The amount to modify the skill by.
         * @param  {boolean}  applying -  [description]
         */
        this.militarySkillModifier += amount;
        this.game.raiseEvent('onCardMilitarySkillChanged', {
            card: this,
            amount: amount,
            applying: applying
        });
    }

    modifyPoliticalSkill(amount, applying = true) {
        /**
         * Modify the political skill.
         * @param  {integer} amount - The amount to modify the skill by.
         * @param  {boolean}  applying -  [description]
         */
        this.politicalSkillModifier += amount;
        this.game.raiseEvent('onCardPoliticalSkillChanged', {
            card: this,
            amount: amount,
            applying: applying
        });
    }

    getMilitarySkill(printed = false) {
        /**
         * Get the military skill.
         * @param  {boolean} printed - Use the printed value of the skill; default false
         * @return {integer} The military skill value
         */
        if(printed) {
            return this.cardData.military;
        }

        if(this.cardData.military !== null && this.cardData.military !== undefined) {
            let skillFromAttachments = _.reduce(this.attachments._wrapped, (skill, card) => skill + parseInt(card.cardData.military_bonus), 0);
            let skillFromGlory = (this.isHonored ? this.getGlory() : 0) - (this.isDishonored ? this.getGlory() : 0);
            return Math.max(0, this.cardData.military + this.militarySkillModifier + skillFromAttachments + skillFromGlory);
        }

        return null;
    }

    getPoliticalSkill(printed = false) {
        /**
         * Get the political skill.
         * @param  {boolean} printed - Use the printed value of the skill; default false
         * @return {integer} The political skill value
         */
        if(printed) {
            return this.cardData.military;
        }

        if(this.cardData.political !== null && this.cardData.political !== undefined) {
            let skillFromAttachments = _.reduce(this.attachments._wrapped, (skill, card) => skill + parseInt(card.cardData.political_bonus), 0);
            let skillFromGlory = (this.isHonored ? this.getGlory() : 0) - (this.isDishonored ? this.getGlory() : 0);
            return Math.max(0, this.cardData.political + this.politicalSkillModifier + skillFromAttachments + skillFromGlory);
        }

        return null;
    }

    modifyFate(fate) {
        /**
         * @param  {integer} fate - the amount of fate to modify this card's fate total by
         */
        var oldFate = this.fate;

        this.fate += fate;

        if(this.fate < 0) {
            this.fate = 0;
        }


        this.game.raiseEvent('onCardFateChanged', { card: this, fate: this.fate - oldFate });

    }

    honor() {
        if(this.isDishonored) {
            this.isDishonored = false;
        } else if(!this.isHonored) {
            this.isHonored = true;
        }
    }

    dishonor() {
        if(this.isHonored) {
            this.isHonored = false;
        } else if(!this.isDishonored) {
            this.isDishonored = true;
        }
    }


    needsCovertTarget() {
        return this.isCovert() && !this.covertTarget;
    }

    canUseCovertToBypass(targetCard) {
        return this.isCovert() && targetCard.canBeBypassedByCovert();
    }
    
    canBeBypassedByCovert() {
        return !this.isCovert();
    }

    useCovertToBypass(targetCard) {
        if(!this.canUseCovertToBypass(targetCard)) {
            return false;
        }

        targetCard.covert = true;
        this.covertTarget = targetCard;

        return true;
    }

    clearBlank() {
        super.clearBlank();
        this.attachments.each(attachment => {
            if(!this.allowAttachment(attachment)) {
                this.controller.discardCardFromPlay(attachment, false);
            }
        });
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
            condition: properties.condition,
            match: (card, context) => card === this.parent && (!properties.match || properties.match(card, context)),
            targetController: 'any',
            effect: properties.effect,
            recalculateWhen: properties.recalculateWhen
        });
    }

    /**
     * Checks whether the passed card meets the attachment restrictions (e.g.
     * Opponent cards only, specific factions, etc) for this card.
     */
    canAttach(player, card) {
        return card && card.getType() === 'character' && this.getType() === 'attachment';
    }
    
    canPlay() {
        return this.owner.canInitiateAction && this.allowGameAction('play');
    }

    /**
     * When this card is about to leave play, gets events required to pass
     * to a CardLeavesPlayEventWindow
     */
    getEventsForDiscardingAttachments() {
        if(this.attachments.size() > 0) {
            return this.attachments.map(attachment => {
                let destination = attachment.isDynasty ? 'dynasty discard pile' : 'conflict discard pile';
                destination = attachment.isAncestral() ? 'hand' : destination;
                return {
                    name: 'onCardLeavesPlay',
                    params: { card: attachment, destination: destination },
                    handler: () => attachment.owner.moveCard(attachment, destination)
                };
            });
        }
        return [];
    }

    getPlayActions() {
        return StandardPlayActions
            .concat(this.abilities.playActions)
            .concat(_.filter(this.abilities.actions, action => !action.allowMenu()));
    }

    leavesPlay() {
        // If this is an attachment and is attached to another card, we need to remove all links between them
        if(this.parent && this.parent.attachments) {
            this.parent.attachments = _(this.parent.attachments.reject(card => card.uuid === this.uuid));
            this.parent = null;
        }

        this.bowed = false;
        this.new = false;
        this.fate = 0;
        if(this.isHonored) {
            this.game.addHonor(this.controller, 1);
            this.game.addMessage('{0} gains 1 honor due to {1}\'s personal honor', this.controller, this);
            this.isHonored = false;
        } else if(this.isDishonored) {
            this.game.addHonor(this.controller, -1);
            this.game.addMessage('{0} loses 1 honor due to {1}\'s personal honor', this.controller, this);
            this.isDishonored = false;
        }
        if(this.hasSincerity()) {
            this.controller.drawCardsToHand(1);
            this.game.addMessage('{0} draws a card due to {1}\'s Sincerity', this.controller, this);
        }
        if(this.hasCourtesy()) {
            this.game.addFate(this.controller, 1);
            this.game.addMessage('{0} gains a fate due to {1}\'s Courtesy', this.controller, this);
        }
        this.resetForConflict();
        super.leavesPlay();
    }

    resetForConflict() {
        this.covert = false;
        //this.covertTarget = undefined;
        this.inConflict = false;
    }

    canDeclareAsAttacker(conflictType) {
        return this.allowGameAction('declareAsAttacker') && this.canParticipateAsAttacker(conflictType);
    }

    canDeclareAsDefender(conflictType) {
        return this.allowGameAction('declareAsDefender') && this.canParticipateAsDefender(conflictType);
    }

    canParticipateInConflict(conflictType) {
        return (
            this.location === 'play area' &&
            !this.covert &&
            (!this.bowed || this.conflictOptions.canBeDeclaredWhileBowed) &&
            !this.conflictOptions.cannotParticipateIn[conflictType]
        );
    }

    canParticipateAsAttacker(conflictType) {
        return this.allowGameAction('participateAsAttacker') && this.canParticipateInConflict(conflictType);
    }

    canParticipateAsDefender(conflictType) {
        return this.allowGameAction('participateAsDefender') && this.canParticipateInConflict(conflictType);
    }

    canBeKilled() {
        return this.allowGameAction('kill');
    }

    canBePlayed() {
        return this.allowGameAction('play');
    }

    returnHomeFromConflict(side) {
        if(!this.conflictOptions.doesNotBowAs[side] && !this.bowed) {
            this.controller.bowCard(this);
        }
        this.inConflict = false;
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
            saved: this.saved,
            fate: this.fate,
            new: this.new,
            covert: this.covert,
            militaryskill: this.getMilitarySkill(),
            politicalskill: this.getPoliticalSkill()
        });
    }
}

module.exports = DrawCard;
