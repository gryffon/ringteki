const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class Retreat extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character home',
            condition: () => this.game.isDuringConflict('military'),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }
}

Retreat.id = 'retreat';

module.exports = Retreat;
