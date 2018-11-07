const StrongholdCard = require('../../strongholdcard.js');
const { CardTypes } = require('../../Constants');

class ShizukaToshi extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow a character',
            condition: () => this.game.isDuringConflict('political'),
            cost: ability.costs.bowSelf(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating() && card.politicalSkill <= 2,
                gameAction: ability.actions.bow()
            }
        });
    }
}

ShizukaToshi.id = 'shizuka-toshi';

module.exports = ShizukaToshi;
