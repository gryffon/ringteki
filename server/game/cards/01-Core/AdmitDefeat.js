const DrawCard = require('../../drawcard.js');

class AdmitDefeat extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow a character',
            condition: () => this.game.currentConflict && this.game.currentConflict.defenders.length === 1,
            target: {
                cardType: 'character',
                cardCondition: card => this.game.currentConflict.isDefending(card),
                gameAction: ability.actions.bow()
            }
        });
    }
}

AdmitDefeat.id = 'admit-defeat';

module.exports = AdmitDefeat;
