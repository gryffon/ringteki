const DrawCard = require('../../drawcard.js');

class DojiChallenger extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character into the conflict',
            condition: context => context.source.isAttacking(),
            target: {
                cardType: 'character',
                gameAction: 'moveToConflict',
                cardCondition: (card, context) => card.controller !== context.player
            }
        });
    }
}

DojiChallenger.id = 'doji-challenger';

module.exports = DojiChallenger;
