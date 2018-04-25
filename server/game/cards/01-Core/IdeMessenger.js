const DrawCard = require('../../drawcard.js');

class IdeMessenger extends DrawCard {
    setupCardAbilities(ability) {
        this.action ({
            title: 'Move an ally to a conflict',
            condition: () => this.game.currentConflict,
            target: {
                cardType: 'character',
                gameAction: 'moveToConflict',
                cardCondition: (card, context) => card.controller === context.player
            },
            cost: ability.costs.payFate(1)
        });
    }
}

IdeMessenger.id = 'ide-messenger';

module.exports = IdeMessenger;
