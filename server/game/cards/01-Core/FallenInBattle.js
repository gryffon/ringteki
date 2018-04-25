const DrawCard = require('../../drawcard.js');

class FallenInBattle extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Discard a character',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && event.conflict.conflictType === 'military' && 
                                                   event.conflict.skillDifference > 4
            },
            max: ability.limit.perConflict(1),
            target: {
                cardType: 'character',
                gameAction: 'discardFromPlay',
                cardCondition: card => card.isParticipating()
            }
        });
    }
}

FallenInBattle.id = 'fallen-in-battle';

module.exports = FallenInBattle;
