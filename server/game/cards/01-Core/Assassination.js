const DrawCard = require('../../drawcard.js');

class Assassination extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a character',
            cost: ability.costs.payHonor(3),
            condition: () => this.game.currentConflict,
            max: ability.limit.perRound(1),
            target: {
                cardType: 'character',
                gameAction: 'discardFromPlay',
                cardCondition: card => card.getCost() < 3
            },
            handler: context => {
                this.game.addMessage('{0} pays 3 honor to use {1} to discard {2}', this.controller, this, context.target);
                this.game.applyGameAction(context, { discardFromPlay: context.target });
            }
        });
    }
}

Assassination.id = 'assassination';

module.exports = Assassination;
