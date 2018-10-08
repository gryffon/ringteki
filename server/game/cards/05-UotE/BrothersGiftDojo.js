const ProvinceCard = require('../../provincecard.js');

class BrothersGiftDojo extends ProvinceCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a character home',
            limit: ability.limit.perRound(2),
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.payHonor(1),
            target: {
                cardType: 'character',
                controller: 'self',
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.sendHome()
            },
            effect: 'move {0} home'
        });
    }
}

BrothersGiftDojo.id = 'brother-s-gift-dojo';

module.exports = BrothersGiftDojo;
