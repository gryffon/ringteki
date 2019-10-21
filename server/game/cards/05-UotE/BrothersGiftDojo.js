const ProvinceCard = require('../../provincecard.js');
const { Players, CardTypes } = require('../../Constants');

class BrothersGiftDojo extends ProvinceCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a character home',
            limit: ability.limit.perRound(2),
            conflictProvinceCondition: () => true,
            cost: ability.costs.payHonor(1),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.sendHome()
            }
        });
    }
}

BrothersGiftDojo.id = 'brother-s-gift-dojo';

module.exports = BrothersGiftDojo;
