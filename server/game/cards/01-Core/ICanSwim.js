const DrawCard = require('../../drawcard.js');

class ICanSwim extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a dishonored character',
            condition: context => context.player.opponent && context.player.showBid > context.player.opponent.showBid,
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.isParticipating() && card.isDishonored && card.controller === context.player.opponent,
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}

ICanSwim.id = 'i-can-swim';

module.exports = ICanSwim;
