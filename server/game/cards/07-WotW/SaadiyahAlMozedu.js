const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, CardTypes } = require('../../Constants');

class SaadiyahAlMozedu extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Flip province facedown',
            cost: AbilityDsl.costs.discardCard({
                location: Locations.Hand
            }),
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: card => !card.isBroken && !card.isConflictProvince(),
                gameAction: AbilityDsl.actions.turnFacedown()
            }
        });
    }
}


SaadiyahAlMozedu.id = 'saadiyah-al-mozedu';

module.exports = SaadiyahAlMozedu;
