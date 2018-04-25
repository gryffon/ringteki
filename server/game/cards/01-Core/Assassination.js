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
                gameAction: ability.actions.discardFromPlay(),
                cardCondition: card => card.getCost() < 3
            }
        });
    }
}

Assassination.id = 'assassination';

module.exports = Assassination;
