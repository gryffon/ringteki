const DrawCard = require('../../drawcard.js');

class IndomitableWill extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Prevent a character from bowing at the end of the conflict',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player &&
                                                   event.conflict.getOpponentCards(event.conflict.loser).length === 1 
            },
            effect: 'prevent {1} from bowing as a result of the conflict\'s resolution',
            effectArgs: context => context.player.cardsInPlay.find(card => card.isParicipating()),
            untilEndOfConflict: context => ({
                match: context.player.cardsInPlay.find(card => card.isParicipating()),
                effect: ability.effects.doesNotBow()
            })
        });
    }
}

IndomitableWill.id = 'indomitable-will';

module.exports = IndomitableWill;
