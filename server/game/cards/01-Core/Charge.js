const DrawCard = require('../../drawcard.js');
const { Locations, Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class Charge extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put a character into play from a province',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'military',
            target: {
                cardType: CardTypes.Character,
                location: Locations.Provinces,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.putIntoConflict()
            }
        });
    }
}

Charge.id = 'charge';

module.exports = Charge;
