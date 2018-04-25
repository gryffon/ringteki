const DrawCard = require('../../drawcard.js');

class IndomitableWill extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Prevent a character from bowing at the end of the conflict',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player &&
                                                   event.conflict.getOpponentCards(event.conflict.loser).length === 1 
            },
            message: '{0} uses {1} to prevent {2} from bowing as a result of the conflict\'s resolution',
            messageItems: context => [context.player.cardsInPlay.find(card => card.isParicipating())],
            handler: context => context.source.untilEndOfConflict(ability => ({
                match: context.player.cardsInPlay.find(card => card.isParicipating()),
                effect: ability.effects.doesNotBow
            }))
        });
    }
}

IndomitableWill.id = 'indomitable-will';

module.exports = IndomitableWill;
