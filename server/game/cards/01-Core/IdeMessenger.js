const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class IdeMessenger extends DrawCard {
    setupCardAbilities(ability) {
        this.action ({
            title: 'Move an ally to a conflict',
            cost: ability.costs.payFate(1),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: ability.actions.moveToConflict()
            }
        });
    }
}

IdeMessenger.id = 'ide-messenger';

module.exports = IdeMessenger;
