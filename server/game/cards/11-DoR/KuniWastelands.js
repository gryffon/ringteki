const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { CardTypes, Locations, Players } = require('../../Constants');

class KuniWastelands extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            targetController: Players.Opponent,
            targetLocation: Locations.PlayArea,
            match: card => card.type === CardTypes.Character,
            effect: [
                AbilityDsl.effects.cardCannot({
                    cannot: 'triggerAbilities',
                    restricts: 'nonForcedAbilities'
                }),
                AbilityDsl.effects.cardCannot({
                    cannot: 'initiateKeywords',
                    restricts: 'keywordAbilities'
                })
            ]
        });
    }
}

KuniWastelands.id = 'kuni-wastelands';

module.exports = KuniWastelands;
