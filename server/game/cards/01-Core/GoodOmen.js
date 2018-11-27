const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class GoodOmen extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Add a fate to a character',
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.getCost() > 2,
                gameAction: ability.actions.placeFate()
            }
        });
    }

    canPlay(context, playType) {
        if(context.player.opponent && context.player.showBid < context.player.opponent.showBid) {
            return super.canPlay(context, playType);
        }
        return false;
    }
}

GoodOmen.id = 'good-omen';

module.exports = GoodOmen;
