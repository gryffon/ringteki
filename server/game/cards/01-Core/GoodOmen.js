const DrawCard = require('../../drawcard.js');

class GoodOmen extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Add a fate to a character',
            target: {
                cardType: 'character',
                gameAction: 'placeFate',
                cardCondition: card => card.getCost() >= 3
            }
        });
    }

    canPlay(context) {
        if(this.controller.opponent && this.controller.showBid < this.controller.opponent.showBid) {
            return super.canPlay(context);
        }
        return false;
    }
}

GoodOmen.id = 'good-omen';

module.exports = GoodOmen;
