const DrawCard = require('../../drawcard.js');

class Charge extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put a character into play from a province',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'military',
            target: {
                cardType: 'character',
                gameAction: ability.actions.putIntoConflict(),
                cardCondition: (card, context) => ['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location) && 
                                                  card.controller === context.player
            }
        });
    }
}

Charge.id = 'charge';

module.exports = Charge;
