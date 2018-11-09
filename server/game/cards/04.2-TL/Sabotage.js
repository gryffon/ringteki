const DrawCard = require('../../drawcard.js');
const { Locations, Players, CardTypes } = require('../../Constants');

class Sabotage extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            condition: () => this.game.isDuringConflict('military'),
            title: 'Discard a card in a province',
            target: {
                location: Locations.Provinces,
                controller: Players.Opponent,
                cardType: [CardTypes.Character,CardTypes.Holding],
                gameAction: ability.actions.discardCard()
            }
        });
    }
}
Sabotage.id = 'sabotage';

module.exports = Sabotage;
