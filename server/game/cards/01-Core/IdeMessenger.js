const DrawCard = require('../../drawcard.js');

class IdeMessenger extends DrawCard {
    setupCardAbilities(ability) {
        this.action ({
            title: 'Move an ally to a conflict',
            cost: ability.costs.payFate(1),
            target: {
                cardCondition: (card, context) => card.controller === context.player,
                gameAction: ability.actions.moveToConflict()
            }
        });
    }
}

IdeMessenger.id = 'ide-messenger';

module.exports = IdeMessenger;
