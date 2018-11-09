const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class ICanSwim extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a dishonored character',
            condition: context => context.player.opponent && context.player.showBid > context.player.opponent.showBid,
            cannotBeMirrored: true,
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating() && card.isDishonored,
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}

ICanSwim.id = 'i-can-swim';

module.exports = ICanSwim;
