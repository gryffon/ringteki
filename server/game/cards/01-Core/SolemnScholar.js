const DrawCard = require('../../drawcard.js');

class SolemnScholar extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow an attacking character',
            condition: () => this.game.currentConflict && this.game.rings.earth.isClaimed(this.controller),
            target: {
                activePromptTitle: 'Select a character',
                cardType: 'character',
                gameAction: 'bow',
                cardCondition: card => card.location === 'play area' && this.game.currentConflict && this.game.currentConflict.isAttacking(card)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to bow {2}', this.controller, this, context.target);
                this.game.applyGameAction(context, { bow: context.target });
            }
        });
    }
}

SolemnScholar.id = 'solemn-scholar';

module.exports = SolemnScholar;
