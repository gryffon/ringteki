const ProvinceCard = require('../../provincecard.js');
const { CardTypes } = require('../../Constants');

class MagistrateStation extends ProvinceCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready an honored character',
            canTriggerOutsideConflict: true,
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isHonored,
                gameAction: ability.actions.ready()
            }
        });
    }
}

MagistrateStation.id = 'magistrate-station';

module.exports = MagistrateStation;
