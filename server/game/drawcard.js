const _ = require('underscore');

const AbilityDsl = require('./abilitydsl.js');
const BaseCard = require('./basecard');
const DynastyCardAction = require('./dynastycardaction.js');
const PlayAttachmentAction = require('./playattachmentaction.js');
const PlayAttachmentOnRingAction = require('./playattachmentonringaction.js');
const PlayCharacterAction = require('./playcharacteraction.js');
const PlayDisguisedCharacterAction = require('./PlayDisguisedCharacterAction');
const DuplicateUniqueAction = require('./duplicateuniqueaction.js');
const CourtesyAbility = require('./KeywordAbilities/CourtesyAbility');
const PrideAbility = require('./KeywordAbilities/PrideAbility');
const SincerityAbility = require('./KeywordAbilities/SincerityAbility');
const StatusToken = require('./StatusToken');
const StatModifier = require('./StatModifier');

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

        this.printedMilitarySkill = this.getPrintedSkill('military');
        this.printedPoliticalSkill = this.getPrintedSkill('political');
        this.printedCost = this.cardData.cost;
        this.printedGlory = parseInt(cardData.glory);
        this.fate = 0;
        this.bowed = false;
        this.covert = false;
        this.isConflict = cardData.side === 'conflict';
        this.isDynasty = cardData.side === 'dynasty';
        this.personalHonor = null;

        this.parseKeywords(cardData.text ? cardData.text.replace(/<[^>]*>/g, '').toLowerCase() : '');

        this.applyAttachmentBonus();

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

    getPrintedSkill(type) {
        if(type === 'military') {
            return this.cardData.military === null || this.cardData.military === undefined ?
                NaN : isNaN(parseInt(this.cardData.military)) ? 0 : parseInt(this.cardData.military);
        } else if(type === 'political') {
            return this.cardData.political === null || this.cardData.political === undefined ?
                NaN : isNaN(parseInt(this.cardData.political)) ? 0 : parseInt(this.cardData.political);
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
                effect: AbilityDsl.effects.modifyMilitarySkill(militaryBonus)
            });
        }
        let politicalBonus = parseInt(this.cardData.political_bonus);
        if(politicalBonus) {
            this.persistentEffect({
                match: (card) => card === this.parent,
                targetController: Players.Any,
                effect: AbilityDsl.effects.modifyPoliticalSkill(politicalBonus)
            });
        }
    }

    hasKeyword(keyword) {
        let addKeywordEffects = this.getEffects(EffectNames.AddKeyword).filter(effectValue => effectValue === keyword.toLowerCase());
        let loseKeywordEffects = this.getEffects(EffectNames.LoseKeyword).filter(effectValue => effectValue === keyword.toLowerCase());
        return addKeywordEffects.length > loseKeywordEffects.length;
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
            card.isInPlay() &&
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

        let baseSkillModifiers = this.getBaseSkillModifiers();

        if(type === 'military') {
            return isNaN(baseSkillModifiers.baseMilitarySkill);
        } else if(type === 'political') {
            return isNaN(baseSkillModifiers.basePoliticalSkill);
        }

        return isNaN(baseSkillModifiers.baseMilitarySkill) || isNaN(baseSkillModifiers.basePoliticalSkill);
    }

    getContributionToConflict(type) {
        let skillFunction = this.mostRecentEffect(EffectNames.ChangeContributionFunction);
        if(skillFunction) {
            return skillFunction(this);
        }
        return this.getSkill(type);
    }

    /**
     * Direct the skill query to the correct sub function.
     * @param  {string} type - The type of the skill; military or political
     * @return {number} The chosen skill value
     */
    getSkill(type) {
        if(type === 'military') {
            return this.getMilitarySkill();
        } else if(type === 'political') {
            return this.getPoliticalSkill();
        }
    }

    getBaseSkillModifiers() {
        const baseModifierEffects = [
            EffectNames.CopyCharacter,
            EffectNames.CalculatePrintedMilitarySkill,
            EffectNames.ModifyBaseMilitarySkillMultiplier,
            EffectNames.ModifyBasePoliticalSkillMultiplier,
            EffectNames.SetBaseMilitarySkill,
            EffectNames.SetBasePoliticalSkill,
            EffectNames.SetBaseDash,
            EffectNames.SwitchBaseSkills,
            EffectNames.SetBaseGlory
        ];

        let baseEffects = this.getRawEffects().filter(effect => baseModifierEffects.includes(effect.type));
        let baseMilitaryModifiers = [StatModifier.fromCard(this.printedMilitarySkill, this, 'Printed skill', false)];
        let basePoliticalModifiers = [StatModifier.fromCard(this.printedPoliticalSkill, this, 'Printed skill', false)];
        let baseMilitarySkill = this.printedMilitarySkill;
        let basePoliticalSkill = this.printedPoliticalSkill;

        baseEffects.forEach(effect => {
            switch(effect.type) {
                case EffectNames.CalculatePrintedMilitarySkill: {
                    let skillFunction = effect.getValue(this);
                    let calculatedSkillValue = skillFunction(this);
                    baseMilitarySkill = calculatedSkillValue;
                    baseMilitaryModifiers = baseMilitaryModifiers.filter(mod => !mod.name.startsWith('Printed skill'));
                    baseMilitaryModifiers.push(StatModifier.fromEffect(baseMilitarySkill, effect, false, `Printed skill due to ${StatModifier.getEffectName(effect)}`));
                    break;
                }
                case EffectNames.CopyCharacter: {
                    let copiedCard = effect.getValue(this);
                    baseMilitarySkill = copiedCard.getPrintedSkill('military');
                    basePoliticalSkill = copiedCard.getPrintedSkill('political');
                    // replace existing base or copied modifier
                    baseMilitaryModifiers = baseMilitaryModifiers.filter(mod => !mod.name.startsWith('Printed skill'));
                    basePoliticalModifiers = basePoliticalModifiers.filter(mod => !mod.name.startsWith('Printed skill'));
                    baseMilitaryModifiers.push(StatModifier.fromEffect(baseMilitarySkill, effect, false, `Printed skill from ${copiedCard.name} due to ${StatModifier.getEffectName(effect)}`));
                    basePoliticalModifiers.push(StatModifier.fromEffect(basePoliticalSkill, effect, false, `Printed skill from ${copiedCard.name} due to ${StatModifier.getEffectName(effect)}`));
                    break;
                }
                case EffectNames.SetBaseDash:
                    if(effect.getValue(this) === 'military') {
                        baseMilitaryModifiers.push(StatModifier.fromEffect(undefined, effect, true, StatModifier.getEffectName(effect)));
                        baseMilitarySkill = NaN;
                    }
                    if(effect.getValue(this) === 'political') {
                        basePoliticalModifiers.push(StatModifier.fromEffect(undefined, effect, true, StatModifier.getEffectName(effect)));
                        basePoliticalSkill = NaN;
                    }
                    break;
                case EffectNames.SetBaseMilitarySkill:
                    baseMilitarySkill = effect.getValue(this);
                    baseMilitaryModifiers.push(StatModifier.fromEffect(baseMilitarySkill, effect, true, `Base set by ${StatModifier.getEffectName(effect)}`));
                    break;
                case EffectNames.SetBasePoliticalSkill:
                    basePoliticalSkill = effect.getValue(this);
                    basePoliticalModifiers.push(StatModifier.fromEffect(basePoliticalSkill, effect, true, `Base set by ${StatModifier.getEffectName(effect)}`));
                    break;
                case EffectNames.SwitchBaseSkills: {
                    const milChange = Math.max(basePoliticalSkill, 0) - Math.max(baseMilitarySkill, 0);
                    const polChange = Math.max(baseMilitarySkill, 0) - Math.max(basePoliticalSkill, 0);
                    baseMilitarySkill += milChange;
                    basePoliticalSkill += polChange;
                    baseMilitaryModifiers.push(StatModifier.fromEffect(milChange, effect, false, `Base due to ${StatModifier.getEffectName(effect)}`));
                    basePoliticalModifiers.push(StatModifier.fromEffect(polChange, effect, false, `Base due to ${StatModifier.getEffectName(effect)}`));
                    break;
                }
                case EffectNames.ModifyBaseMilitarySkillMultiplier: {
                    const milChange = (effect.getValue(this) - 1) * baseMilitarySkill;
                    baseMilitarySkill += milChange;
                    baseMilitaryModifiers.push(StatModifier.fromEffect(milChange, effect, false, `Base due to ${StatModifier.getEffectName(effect)}`));
                    break;
                }
                case EffectNames.ModifyBasePoliticalSkillMultiplier: {
                    const polChange = (effect.getValue(this) - 1) * basePoliticalSkill;
                    basePoliticalSkill += polChange;
                    basePoliticalModifiers.push(StatModifier.fromEffect(polChange, effect, false, `Base due to ${StatModifier.getEffectName(effect)}`));
                    break;
                }
            }
        });

        let overridingMilModifiers = baseMilitaryModifiers.filter(mod => mod.overrides);
        if(overridingMilModifiers.length > 0) {
            let lastModifier = _.last(overridingMilModifiers);
            baseMilitaryModifiers = [lastModifier];
            baseMilitarySkill = lastModifier.amount;
        }
        let overridingPolModifiers = basePoliticalModifiers.filter(mod => mod.overrides);
        if(overridingPolModifiers.length > 0) {
            let lastModifier = _.last(overridingPolModifiers);
            basePoliticalModifiers = [lastModifier];
            basePoliticalSkill = lastModifier.amount;
        }

        return {
            baseMilitaryModifiers: baseMilitaryModifiers,
            baseMilitarySkill: baseMilitarySkill,
            basePoliticalModifiers: basePoliticalModifiers,
            basePoliticalSkill: basePoliticalSkill
        };
    }

    getMilitaryModifiers() {
        let baseSkillModifiers = this.getBaseSkillModifiers();
        if(isNaN(baseSkillModifiers.baseMilitarySkill)) {
            return baseSkillModifiers.baseMilitaryModifiers;
        }

        // set effects
        let setEffects = this.getRawEffects().filter(effect => effect.type === EffectNames.SetMilitarySkill || effect.type === EffectNames.SetDash);
        if(setEffects.length > 0) {
            let latestSetEffect = _.last(setEffects);
            let setAmount = latestSetEffect.type === EffectNames.SetDash ? undefined : latestSetEffect.getValue(this);
            return [StatModifier.fromEffect(setAmount, latestSetEffect, true, `Set by ${StatModifier.getEffectName(latestSetEffect)}`)];
        }

        let modifiers = baseSkillModifiers.baseMilitaryModifiers;

        // skill modifiers
        let modifierEffects = this.getRawEffects().filter(effect => effect.type === EffectNames.ModifyMilitarySkill || effect.type === EffectNames.ModifyBothSkills);
        modifierEffects.forEach(modifierEffect => {
            const value = modifierEffect.getValue(this);
            modifiers.push(StatModifier.fromEffect(value, modifierEffect));
        });

        // adjust honor status effects
        this.adjustHonorStatusModifiers(modifiers);

        // multipliers
        let multiplierEffects = this.getRawEffects().filter(effect => effect.type === EffectNames.ModifyMilitarySkillMultiplier);
        multiplierEffects.forEach(multiplierEffect => {
            let multiplier = multiplierEffect.getValue(this);
            let currentTotal = modifiers.reduce((total, modifier) => total + modifier.amount, 0);
            let amount = (multiplier - 1) * currentTotal;
            modifiers.push(StatModifier.fromEffect(amount, multiplierEffect));
        });

        return modifiers;
    }

    getPoliticalModifiers() {
        let baseSkillModifiers = this.getBaseSkillModifiers();
        if(isNaN(baseSkillModifiers.basePoliticalSkill)) {
            return baseSkillModifiers.basePoliticalModifiers;
        }

        // set effects
        let setEffects = this.getRawEffects().filter(effect => effect.type === EffectNames.SetPoliticalSkill);
        if(setEffects.length > 0) {
            let latestSetEffect = _.last(setEffects);
            let setAmount = latestSetEffect.getValue(this);
            return [StatModifier.fromEffect(setAmount, latestSetEffect, true, `Set by ${StatModifier.getEffectName(latestSetEffect)}`)];
        }

        let modifiers = baseSkillModifiers.basePoliticalModifiers;

        // skill modifiers
        let modifierEffects = this.getRawEffects().filter(effect => effect.type === EffectNames.ModifyPoliticalSkill || effect.type === EffectNames.ModifyBothSkills);
        modifierEffects.forEach(modifierEffect => {
            const value = modifierEffect.getValue(this);
            modifiers.push(StatModifier.fromEffect(value, modifierEffect));
        });

        // adjust honor status effects
        this.adjustHonorStatusModifiers(modifiers);

        // multipliers
        let multiplierEffects = this.getRawEffects().filter(effect => effect.type === EffectNames.ModifyPoliticalSkillMultiplier);
        multiplierEffects.forEach(multiplierEffect => {
            let multiplier = multiplierEffect.getValue(this);
            let currentTotal = modifiers.reduce((total, modifier) => total + modifier.amount, 0);
            let amount = (multiplier - 1) * currentTotal;
            modifiers.push(StatModifier.fromEffect(amount, multiplierEffect));
        });

        return modifiers;
    }

    adjustHonorStatusModifiers(modifiers) {
        let doesNotModifyEffects = this.getRawEffects().filter(effect => effect.type === EffectNames.HonorStatusDoesNotModifySkill);
        if(doesNotModifyEffects.length > 0) {
            modifiers.forEach(modifier => {
                if(modifier.type === 'token' && modifier.amount !== 0) {
                    modifier.amount = 0;
                    modifier.name += ` (${StatModifier.getEffectName(doesNotModifyEffects[0])})`;
                }
            });
        }
        let reverseEffects = this.getRawEffects().filter(effect => effect.type === EffectNames.HonorStatusReverseModifySkill);
        if(reverseEffects.length > 0) {
            modifiers.forEach(modifier => {
                if(modifier.type === 'token' && modifier.amount !== 0) {
                    modifier.amount = 0 - modifier.amount;
                    modifier.name += ` (${StatModifier.getEffectName(reverseEffects[0])})`;
                }
            });
        }
    }

    get showStats() {
        return this.location === Locations.PlayArea && this.type === CardTypes.Character;
    }

    get militarySkillSummary() {
        if(!this.showStats) {
            return;
        }
        let modifiers = this.getMilitaryModifiers().map(modifier => Object.assign({}, modifier));
        let skill = modifiers.reduce((total, modifier) => total + modifier.amount, 0);
        return {
            stat: isNaN(skill) ? '-' : Math.max(skill, 0).toString(),
            modifiers: modifiers
        };
    }

    get politicalSkillSummary() {
        if(!this.showStats) {
            return;
        }
        let modifiers = this.getPoliticalModifiers().map(modifier => Object.assign({}, modifier));
        modifiers.forEach(modifier => modifier = Object.assign({}, modifier));
        let skill = modifiers.reduce((total, modifier) => total + modifier.amount, 0);
        return {
            stat: isNaN(skill) ? '-' : Math.max(skill, 0).toString(),
            modifiers: modifiers
        };
    }

    get glorySummary() {
        if(!this.showStats) {
            return;
        }
        let modifiers = this.getGloryModifiers().map(modifier => Object.assign({}, modifier));
        modifiers.forEach(modifier => modifier = Object.assign({}, modifier));
        let stat = modifiers.reduce((total, modifier) => total + modifier.amount, 0);
        return {
            stat: Math.max(stat, 0).toString(),
            modifiers: modifiers
        };
    }

    get glory() {
        return this.getGlory();
    }

    getGlory() {
        let gloryModifiers = this.getGloryModifiers();
        let glory = gloryModifiers.reduce((total, modifier) => total + modifier.amount, 0);
        if(isNaN(glory)) {
            return 0;
        }
        return Math.max(0, glory);
    }

    getGloryModifiers() {
        const gloryModifierEffects = [
            EffectNames.CopyCharacter,
            EffectNames.SetGlory,
            EffectNames.ModifyGlory,
            EffectNames.SetBaseGlory
        ];

        // glory undefined (Holding etc.)
        if(this.printedGlory === undefined) {
            return [];
        }

        let gloryEffects = this.getRawEffects().filter(effect => gloryModifierEffects.includes(effect.type));

        let gloryModifiers = [];

        // set effects
        let setEffects = gloryEffects.filter(effect => effect.type === EffectNames.SetGlory);
        if(setEffects.length > 0) {
            let latestSetEffect = _.last(setEffects);
            let setAmount = latestSetEffect.getValue(this);
            return [StatModifier.fromEffect(setAmount, latestSetEffect, true, `Set by ${StatModifier.getEffectName(latestSetEffect)}`)];
        }

        // base effects/copy effects/printed glory
        let baseEffects = gloryEffects.filter(effect => effect.type === EffectNames.SetBaseGlory);
        let copyEffects = gloryEffects.filter(effect => effect.type === EffectNames.CopyCharacter);
        if(baseEffects.length > 0) {
            let latestBaseEffect = _.last(baseEffects);
            let baseAmount = latestBaseEffect.getValue(this);
            gloryModifiers.push(StatModifier.fromEffect(baseAmount, latestBaseEffect, true, `Base set by ${StatModifier.getEffectName(latestBaseEffect)}`));
        } else if(copyEffects.length > 0) {
            let latestCopyEffect = _.last(copyEffects);
            let copiedCard = latestCopyEffect.getValue(this);
            gloryModifiers.push(StatModifier.fromEffect(copiedCard.printedGlory, latestCopyEffect, false, `Printed glory from ${copiedCard.name} due to ${StatModifier.getEffectName(latestCopyEffect)}`));
        } else {
            gloryModifiers.push(StatModifier.fromCard(this.printedGlory, this, 'Printed glory', false));
        }

        // skill modifiers
        let modifierEffects = gloryEffects.filter(effect => effect.type === EffectNames.ModifyGlory);
        modifierEffects.forEach(modifierEffect => {
            const value = modifierEffect.getValue(this);
            gloryModifiers.push(StatModifier.fromEffect(value, modifierEffect));
        });

        return gloryModifiers;
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
        if(isNaN(skill)) {
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
        if(isNaN(skill)) {
            return 0;
        }
        return floor ? Math.max(0, skill) : skill;
    }

    get baseMilitarySkill() {
        return this.getBaseMilitarySkill();
    }

    getBaseMilitarySkill() {
        let skill = this.getBaseSkillModifiers().baseMilitarySkill;
        if(isNaN(skill)) {
            return 0;
        }
        return Math.max(0, skill);
    }

    get basePoliticalSkill() {
        return this.getBasePoliticalSkill();
    }

    getBasePoliticalSkill() {
        let skill = this.getBaseSkillModifiers().basePoliticalSkill;
        if(isNaN(skill)) {
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
        if(this.personalHonor && token !== this.personalHonor) {
            this.personalHonor.setCard(null);
        }
        this.personalHonor = token || null;
        if(this.personalHonor) {
            this.personalHonor.setCard(this);
        }
    }

    get isHonored() {
        return !!this.personalHonor && !!this.personalHonor.honored;
    }

    honor() {
        if(this.isHonored) {
            return;
        } else if(this.isDishonored) {
            this.makeOrdinary();
        } else {
            this.setPersonalHonor(new StatusToken(this.game, this, true));
        }
    }

    get isDishonored() {
        return !!this.personalHonor && !!this.personalHonor.dishonored;
    }

    dishonor() {
        if(this.isDishonored) {
            return;
        } if(this.isHonored) {
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
    canAttach(parent, context, ignoreType = false) {
        if(!parent || parent.getType() !== CardTypes.Character || !ignoreType && this.getType() !== CardTypes.Attachment) {
            return false;
        }
        if(this.anyEffect(EffectNames.AttachmentMyControlOnly) && context.player !== parent.controller) {
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

    canPlay(context, type) {
        return this.checkRestrictions(type, context) && context.player.checkRestrictions(type, context) &&
            this.checkRestrictions('play', context) && context.player.checkRestrictions('play', context);
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

    updateEffects(from, to) {
        super.updateEffects(from, to);
        this.setPersonalHonor(this.personalHonor);
    }

    resetForConflict() {
        this.covert = false;
        this.inConflict = false;
    }

    canBeBypassedByCovert(context) {
        return !this.isCovert() && this.checkRestrictions('applyCovert', context);
    }

    canDeclareAsAttacker(conflictType, ring, province) { // eslint-disable-line no-unused-vars
        const attackers = this.game.isDuringConflict() ? this.game.currentConflict.attackers : [];
        if(attackers.concat(this).reduce((total, card) => total + card.sumEffects(EffectNames.FateCostToAttack), 0) > this.controller.fate) {
            return false;
        }
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
        if(this.location === Locations.PlayArea || this.type === CardTypes.Holding && this.location.includes('province')) {
            return this.mostRecentEffect(EffectNames.TakeControl) || this.defaultController;
        }
        return this.owner;
    }

    canDisguise(card, context, intoConflictOnly) {
        return this.disguisedKeywordTraits.some(trait => card.hasTrait(trait)) &&
            card.allowGameAction('discardFromPlay', context) &&
            !card.isUnique() &&
            (!intoConflictOnly || card.isParticipating());
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
            politicalSkillSummary: this.politicalSkillSummary,
            glorySummary: this.glorySummary,
            controller: this.controller.getShortSummary()
        });
    }
}

module.exports = DrawCard;
