const DrawCard = require('../../drawcard.js');

class TestOfCourage extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a character into conflict',
            condition: context => context.player.opponent && context.player.showBid < context.player.opponent.showBid,
            target: {
                cardType: 'character',
                controller: 'self',
                cardCondition: card => card.isFaction('lion'),
                gameAction: ability.actions.moveToConflict()
            },
            then: context => ({
                gameAction: ability.actions.honor({ target: context.target })
            })
        });
    }
}

TestOfCourage.id = 'test-of-courage';

module.exports = TestOfCourage;
