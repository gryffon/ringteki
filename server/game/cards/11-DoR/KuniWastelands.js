const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { Players } = require('../../Constants');

class KuniWastelands extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            targetController: Players.Opponent,
            effect: [
                AbilityDsl.effects.playerCannot({
                    cannot: 'triggerAbilities',
                    restricts: 'nonForcedCharacterAbilities'
                }),
                AbilityDsl.effects.playerCannot({
                    cannot: 'initiateKeywords',
                    restricts: 'characterKeywordAbilities'
                })
            ]
        });
    }
}

KuniWastelands.id = 'kuni-wastelands';

module.exports = KuniWastelands;
