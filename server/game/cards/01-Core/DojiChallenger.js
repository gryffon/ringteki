const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class DojiChallenger extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a character into the conflict',
            condition: context => context.source.isAttacking(),
            target: {
                cardType: 'character',
                controller: Players.Opponent,
                gameAction: ability.actions.moveToConflict()
            }
        });
    }
}

DojiChallenger.id = 'doji-challenger';

module.exports = DojiChallenger;
