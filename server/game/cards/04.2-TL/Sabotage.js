const DrawCard = require('../../drawcard.js');
const { Locations, Players } = require('../../Constants');

class Sabotage extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            condition: () => this.game.isDuringConflict('military'),
            title: 'Discard a card in a province',
            target: {
                location: Locations.Provinces,
                controller: Players.Opponent,
                cardType: ['character','holding'],
                gameAction: ability.actions.discardCard()
            }
        });
    }
}
Sabotage.id = 'sabotage';

module.exports = Sabotage;
