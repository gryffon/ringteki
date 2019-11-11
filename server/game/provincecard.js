const _ = require('underscore');

const DrawCard = require('./drawcard');
const { Locations, EffectNames } = require('./Constants');

class ProvinceCard extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.isProvince = true;
        this.isBroken = false;
        this.menu = _([{ command: 'break', text: 'Break/unbreak this province' }, { command: 'hide', text: 'Flip face down' }]);
    }

    get strength() {
        return this.getStrength();
    }

    getStrength() {
        if(this.anyEffect(EffectNames.SetProvinceStrength)) {
            return this.mostRecentEffect(EffectNames.SetProvinceStrength);
        }

        let strength = this.baseStrength + this.sumEffects(EffectNames.ModifyProvinceStrength) + this.getDynastyOrStrongholdCardModifier();
        strength = this.getEffects(EffectNames.ModifyProvinceStrengthMultiplier).reduce((total, value) => total * value, strength);
        return Math.max(0, strength);
    }

    get baseStrength() {
        return this.getBaseStrength();
    }

    getBaseStrength() {
        if(this.anyEffect(EffectNames.SetBaseProvinceStrength)) {
            return this.mostRecentEffect(EffectNames.SetBaseProvinceStrength);
        }
        return this.sumEffects(EffectNames.ModifyBaseProvinceStrength) + (parseInt(this.cardData.strength) ? parseInt(this.cardData.strength) : 0);
    }

    getDynastyOrStrongholdCardModifier() {
        let province = this.controller.getSourceList(this.location);
        return province.reduce((bonus, card) => bonus + card.getProvinceStrengthBonus(), 0);
    }

    get element() {
        return this.getElement();
    }

    getElement() {
        return this.cardData.element;
    }

    isElement(element) {
        return this.element === 'all' || this.element === element;
    }

    flipFaceup() {
        this.facedown = false;
    }

    isConflictProvince() {
        return this.game.currentConflict && this.game.currentConflict.conflictProvince === this;
    }

    canBeAttacked() {
        return !this.isBroken && !this.anyEffect(EffectNames.CannotBeAttacked) &&
            (this.location !== Locations.StrongholdProvince || this.controller.getProvinces(card => card.isBroken).length > 2);
    }

    canDeclare(type, ring) { // eslint-disable-line no-unused-vars
        return this.canBeAttacked() && !this.getEffects(EffectNames.CannotHaveConflictsDeclaredOfType).includes(type);
    }

    isBlank() {
        return this.isBroken || super.isBlank();
    }

    breakProvince() {
        this.isBroken = true;
        if(this.controller.opponent) {
            this.game.addMessage('{0} has broken {1}!', this.controller.opponent, this);
            if(this.location === Locations.StrongholdProvince) {
                this.game.recordWinner(this.controller.opponent, 'conquest');
            } else {
                let dynastyCard = this.controller.getDynastyCardInProvince(this.location);
                if(dynastyCard) {
                    let promptTitle = 'Do you wish to discard ' + (dynastyCard.facedown ? 'the facedown card' : dynastyCard.name) + '?';
                    this.game.promptWithHandlerMenu(this.controller.opponent, {
                        activePromptTitle: promptTitle,
                        source: 'Break ' + this.name,
                        choices: ['Yes', 'No'],
                        handlers: [
                            () => {
                                this.game.addMessage('{0} chooses to discard {1}', this.controller.opponent, dynastyCard.facedown ? 'the facedown card' : dynastyCard);
                                this.game.applyGameAction(this.game.getFrameworkContext(), { discardCard: dynastyCard });
                            },
                            () => this.game.addMessage('{0} chooses not to discard {1}', this.controller.opponent, dynastyCard.facedown ? 'the facedown card' : dynastyCard)
                        ]
                    });
                }
            }
        }
    }

    cannotBeStrongholdProvince() {
        return false;
    }

    startsGameFaceup() {
        return false;
    }

    hideWhenFacedown() {
        return false;
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let baseSummary = super.getSummary(activePlayer, hideWhenFaceup);

        return _.extend(baseSummary, {
            isProvince: this.isProvince,
            isBroken: this.isBroken,
            attachments: this.attachments.map(attachment => {
                return attachment.getSummary(activePlayer, hideWhenFaceup);
            })
        });
    }

    allowAttachment(attachment) {
        if(_.any(this.allowedAttachmentTraits, trait => attachment.hasTrait(trait))) {
            return true;
        }

        return (
            !this.isBroken
        );
    }
}

module.exports = ProvinceCard;
