const DrawCard = require('../../drawcard.js');

class IdeMessenger extends DrawCard {
    setupCardAbilities(ability) {
        this.action ({
            title: 'Move an ally to a conflict',
            condition: () => this.game.currentConflict,
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                gameAction: 'moveToConflict',
                cardCondition: card => !card.isParticipating() && card.location === 'play area' && card.controller === this.controller
            },
            cost: ability.costs.payFate(1),
            handler: context => {
                this.game.addMessage('{0} uses {1} to move {2} to the conflict', this.controller, this, context.target);
                this.game.currentConflict.moveToConflict(context.target);
            }

        });
    }
}

IdeMessenger.id = 'ide-messenger';

module.exports = IdeMessenger;
