const DrawCard = require('../../drawcard.js');

class GoodOmen extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Add a fate to a character',
            target: {
                cardType: 'character',
                gameAction: 'placeFate',
                cardCondition: card => card.getCost() >= 3 && card.location === 'play area'
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to add 1 fate to {2}', this.controller, this, context.target);
                this.game.applyGameAction(context, { placeFate: context.target });
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
