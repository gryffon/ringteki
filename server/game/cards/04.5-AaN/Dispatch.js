const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class Dispatch extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a character into or out of the conflict',
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isFaction('unicorn'),
                controller: Players.Self,
                gameAction: [ability.actions.sendHome(), ability.actions.moveToConflict()]
            }
        });
    }
}

Dispatch.id = 'dispatch';

module.exports = Dispatch;
