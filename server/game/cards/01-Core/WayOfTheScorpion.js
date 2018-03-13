const DrawCard = require('../../drawcard.js');

class WayOfTheScorpion extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Dishonor a participating character',
            condition: () => this.game.currentConflict,
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                gameAction:'dishonor',
                cardCondition: card => card.isParticipating() && !card.isFaction('scorpion')
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to dishonor {2}', this.controller, this, context.target);
                this.game.applyGameAction(context, { dishonor: context.target });
            }
        });
    }
}

WayOfTheScorpion.id = 'way-of-the-scorpion';

module.exports = WayOfTheScorpion;
