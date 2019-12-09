const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Locations } = require('../../Constants');

class NorthernCurtainWall extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Locations.Provinces,
            match: (card, context) => {
                if(card.type === CardTypes.Holding) {
                    let isWall = card.hasTrait('kaiu-wall') && !card.facedown;
                    return isWall && context.player.areLocationsAdjacent(context.source.location, card.location);
                }
                return false;
            },
            effect: AbilityDsl.effects.modifyProvinceStrengthBonus(2)
        });
    }
}

NorthernCurtainWall.id = 'northern-curtain-wall';

module.exports = NorthernCurtainWall;
