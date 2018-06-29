const DrawCard = require('../../drawcard.js');

class Sabotage extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            condition: this.game.isDuringConflict('military'),
            title: 'Discard a card in a province',
            target: {
                activePromptTitle: 'Choose a card in your opponent\'s province',
                location: 'province',
                controller: 'opponent',
                gameAction: ability.actions.discardCard()
            }
        });
    }
}
Sabotage.id = 'sabotage';

module.exports = Sabotage;
