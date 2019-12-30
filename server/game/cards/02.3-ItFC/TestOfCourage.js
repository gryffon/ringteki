const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes } = require('../../Constants');

class TestOfCourage extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character into conflict',
            condition: context => context.player.opponent && context.player.showBid < context.player.opponent.showBid,
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.isFaction('lion'),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.moveToConflict(),
                    AbilityDsl.actions.honor()
                ])
            },
            effect: 'move {0} to the conflict and honor it'
        });
    }
}

TestOfCourage.id = 'test-of-courage';

module.exports = TestOfCourage;
