const DrawCard = require('../../drawcard.js');

class FromTheShadows extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put a shinobi character into the conflict from hand or a province, dishonored',
            condition: (context) =>
                this.game.currentConflict &&
                context.source.controller.honor < context.source.controller.opponent.honor,
            target: {
                cardType: 'character',
                location: ['province', 'hand'],
                controller: 'self',
                cardCondition: (card) => card.hasTrait('shinobi'),
                gameAction: ability.actions.putIntoConflict({ status: 'dishonored' })
            }
        });
    }
}

FromTheShadows.id = 'from-the-shadows';

module.exports = FromTheShadows;
