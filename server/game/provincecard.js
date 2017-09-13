const _ = require('underscore');

const BaseCard = require('./basecard.js');

class ProvinceCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.strengthModifier = 0;
        this.isProvince = true;
        this.isBroken = false;
    }

    getStrength() {
        return this.cardData.province_strength + this.strengthModifier;
    }

    flipFaceup() {
        this.facedown = false;
    }
    
    breakProvince() {
        this.broken = true;
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let baseSummary = super.getSummary(activePlayer, hideWhenFaceup);

        return _.extend(baseSummary, {
            isProvince: this.isProvince,
            strength: this.getStrength(),
            isBroken: this.isBroken
        });
    }

}

module.exports = ProvinceCard;
