const DrawCard = require('../../drawcard.js');

class TestOfCourage extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a character into conflict',
            condition: context => context.player.opponent && context.player.showBid < context.player.opponent.showBid,
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.controller === context.player && card.isFaction('lion'),
                gameAction: ability.actions.moveToConflict()
            },
            then: {
                gameAction: ability.actions.honor().target(context => context.target)
            }
        });
    }
}

TestOfCourage.id = 'test-of-courage';

module.exports = TestOfCourage;
