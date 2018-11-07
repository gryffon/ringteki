const DrawCard = require('../../drawcard.js');
const { Locations, Players } = require('../../Constants');

class Charge extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put a character into play from a province',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'military',
            target: {
                cardType: 'character',
                location: Locations.Provinces,
                controller: Players.Self,
                gameAction: ability.actions.putIntoConflict()
            }
        });
    }
}

Charge.id = 'charge';

module.exports = Charge;
