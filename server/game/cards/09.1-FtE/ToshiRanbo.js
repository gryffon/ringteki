const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations } = require('../../Constants');

class ToshiRanbo extends ProvinceCard {
    setupCardAbilities() {
        this.facedown = false;

        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot('turnFacedown')
        });

        this.persistentEffect({
            targetLocation: Locations.Provinces,
            match: (card, context) => card.isDynasty && card.location === context.source.location,
            effect: AbilityDsl.effects.gainExtraFateWhenPlayed()
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}

ToshiRanbo.id = 'toshi-ranbo';

module.exports = ToshiRanbo;
