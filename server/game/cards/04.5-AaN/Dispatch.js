const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class Dispatch extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a character into or out of the conflict',
            target: {
                cardType: 'character',
                cardCondition: card => card.isFaction('unicorn'),
                controller: Players.Self,
                gameAction: [ability.actions.sendHome(), ability.actions.moveToConflict()]
            }
        });
    }
}

Dispatch.id = 'dispatch';

module.exports = Dispatch;
