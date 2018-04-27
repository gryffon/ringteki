const DrawCard = require('../../drawcard.js');

class DojiChallenger extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a character into the conflict',
            condition: context => context.source.isAttacking(),
            target: {
                cardType: 'character',
                gameAction: ability.actions.moveToConflict(),
                cardCondition: (card, context) => card.controller !== context.player
            }
        });
    }
}

DojiChallenger.id = 'doji-challenger';

module.exports = DojiChallenger;
