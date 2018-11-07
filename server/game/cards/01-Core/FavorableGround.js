const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class FavorableGround extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a character into or out of the conflict',
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardType: 'character',
                controller: Players.Self,
                gameAction: [ability.actions.sendHome(), ability.actions.moveToConflict()]
            }
        });
    }
}

FavorableGround.id = 'favorable-ground';

module.exports = FavorableGround;
