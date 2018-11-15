const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class FavorableGround extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a character into or out of the conflict',
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: [ability.actions.sendHome(), ability.actions.moveToConflict()]
            }
        });
    }
}

FavorableGround.id = 'favorable-ground';

module.exports = FavorableGround;
