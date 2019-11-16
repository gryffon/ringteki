const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Locations } = require('../../Constants');

class NorthernCurtainWall extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Locations.Provinces,
            match: (card, context) => {
                if(card.isProvince) {
                    let cardsInProvice = context.player.getDynastyCardsInProvince(card.location);
                    let hasWall = cardsInProvice.some(element => element.type === CardTypes.Holding && element.hasTrait('kaiu-wall') && !element.facedown);

                    return hasWall && context.player.areLocationsAdjacent(context.source.location, card.location);
                }
                return false;
            },
            effect: AbilityDsl.effects.modifyProvinceStrength(2)
        });
    }
}

NorthernCurtainWall.id = 'northern-curtain-wall';

module.exports = NorthernCurtainWall;
